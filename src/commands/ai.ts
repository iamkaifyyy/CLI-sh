import chalk from "chalk";
import * as fs from "fs";

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function handleAi(args: string[]): Promise<void> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log(chalk.red("No GEMINI_API_KEY found in .env"));
    return;
  }

  // kaif > ai explain index.ts  -> args = ["explain", "index.ts"]
  const subcommand = args[0];
  let prompt = "";

  if (subcommand === "explain" && args[1]) {
    const filePath = args[1];
    if (!fs.existsSync(filePath)) {
      console.log(chalk.red(`File not found: ${filePath}`));
      return;
    }
    const fileContent = fs.readFileSync(filePath, "utf-8");
    prompt = `Explain what this code does, concisely:\n\n${fileContent}`;
  } else {
    // kaif > ai whatever question you want
    prompt = args.join(" ");
  }

  if (!prompt) {
    console.log(chalk.red("Usage: ai <question>  OR  ai explain <file>"));
    return;
  }

  console.log(chalk.gray("thinking..."));

  try {
    const response = await fetch(`${API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    console.log(chalk.cyan(text || "No response from Gemini."));
  } catch (err: any) {
    console.log(chalk.red(`AI error: ${err.message}`));
  }
}
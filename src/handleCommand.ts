import { execa } from "execa";
import * as fs from "fs";

function parseInput(input: string): { command: string; args: string[] } {
  const parts = input.trim().split(/\s+/);
  return { command: parts[0] || "", args: parts.slice(1) };
}

export async function handleCommand(input: string): Promise<string> {
  const { command, args } = parseInput(input);

  if (command === "") return "";

  switch (command) {
    case "pwd":
      return process.cwd();

    case "help":
      return "Built-ins: pwd, help, git sync, ai <question>, ai explain <file>";

    case "git":
      if (args[0] === "sync") {
        return await webGitSync();
      }
      return await runSystem(command, args);

    case "ai":
      return await webHandleAi(args);

    default:
      return await runSystem(command, args);
  }
}

async function runSystem(command: string, args: string[]): Promise<string> {
  try {
    const result = await execa(command, args);
    return result.stdout;
  } catch (err: any) {
    return `Error: ${err.shortMessage || err.message}`;
  }
}

async function webGitSync(): Promise<string> {
  let log = "";
  try {
    log += "→ git pull\r\n" + (await execa("git", ["pull"])).stdout + "\r\n";
    log += "→ git add .\r\n" + (await execa("git", ["add", "."])).stdout + "\r\n";
    log += "→ git commit\r\n" + (await execa("git", ["commit", "-m", "CLI-sh sync"])).stdout + "\r\n";
    log += "→ git push\r\n" + (await execa("git", ["push"])).stdout + "\r\n";
    log += "✓ sync complete";
    return log;
  } catch (err: any) {
    return log + `sync failed: ${err.shortMessage || err.message}`;
  }
}

async function webHandleAi(args: string[]): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return "No GEMINI_API_KEY found in .env";

  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
  const subcommand = args[0];
  let prompt = "";

  if (subcommand === "explain" && args[1]) {
    const filePath = args[1];
    if (!fs.existsSync(filePath)) return `File not found: ${filePath}`;
    const fileContent = fs.readFileSync(filePath, "utf-8");
    prompt = `Explain what this code does, concisely:\n\n${fileContent}`;
  } else {
    prompt = args.join(" ");
  }

  if (!prompt) return "Usage: ai <question>  OR  ai explain <file>";

  try {
    const response = await fetch(`${API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });
    const data = await response.json();
    if (data.error) {
      return `AI API Error: ${data.error.message}`;
    }
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || "No response from Gemini.";
  } catch (err: any) {
    return `AI error: ${err.message}`;
  }
}
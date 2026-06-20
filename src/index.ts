import * as readline from "readline";
import chalk from "chalk";
import { handlePwd, handleCd, handleHelp } from "./builtins";
import { runSystemCommand } from "./passthrough";
import { gitSync  } from "./commands/gitSync";
import "dotenv/config";
import { handleAi } from "./commands/ai";


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.green("CLI-sh >"),
});


function parseInput(input: string): { command: string; args: string[] } {
    const parts = input.trim().split(/\s+/);
    const command = parts[0] || "";
    const args = parts.slice(1);
    return { command, args };
}

rl.prompt();

rl.on("line", async (input: string) => {
  const { command, args } = parseInput(input);

  if (command === "") {
    rl.prompt();
    return;
  }

  if (command === "exit") {
    console.log(chalk.yellow("Bye!"));
    process.exit(0);
  }
  console.log(`command: ${command}, args:`, args);

  switch (command) {
    case "pwd":
      handlePwd();
      break;

    case "cd":
      handleCd(args);
      break;

    case "help":
      handleHelp();
      break;

    case "ai":
        await handleAi(args);
        break;

    case "git":
        if(args[0] === "sync"){
            await gitSync()
            
        } else {
            await runSystemCommand(command,args);
            break;
        }

    default:
      await runSystemCommand(command, args);
      console.log(
        chalk.red(`Unknown command: ${command} (passthrough comes in Step 6)`)
      );
  }


  rl.prompt();
});
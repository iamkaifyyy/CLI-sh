import chalk from "chalk";
import { compileFunction } from "node:vm";

export function handlePwd(): void {
    console.log(process.cwd());
}

export function handleCd(args: string[]): void {
    const target = args[0] || process.env.HOME || "/";
    try {
        process.chdir(target);
    } catch (err) {
        console.log(chalk.red(`cd: no such directory: ${target}`));
    }
}

export function handleHelp(): void {
  console.log(chalk.cyan(`
CLI-sh - your custom shell

Built-ins:
  pwd            show current directory
  cd <dir>       change directory
  help           show this message
  exit           quit CLI-sh

Anything else gets passed to your system shell (ls, git, etc.)
  `));
} 
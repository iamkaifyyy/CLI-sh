import { execa } from "execa";
import chalk from "chalk";

export async function runSystemCommand(command: string, args: string[]): Promise<void> {
  try {
    const result = await execa(command, args, {
      stdio: "inherit", // <-- KEY: this pipes the child's input/output directly to YOUR terminal
    });
  } catch (err: any) {
    console.log(chalk.red(`Error: ${err.shortMessage || err.message}`));
  }
}
import { execa } from "execa";
import chalk from "chalk";

export async function gitSync(): Promise<void> {
  try {
    const { stdout: branch } = await execa("git", ["branch", "--show-current"]);

    console.log(chalk.blue("→ git pull"));
    await execa("git", ["pull", "origin", branch], { stdio: "inherit" }).catch(() => {});

    console.log(chalk.blue("→ git add ."));
    await execa("git", ["add", "."], { stdio: "inherit" });

    console.log(chalk.blue("→ git commit"));
    await execa("git", ["commit", "-m", "CLI-sh sync"], { stdio: "inherit" }).catch(() => {});

    console.log(chalk.blue("→ git push"));
    await execa("git", ["push", "origin", branch], { stdio: "inherit" });

    console.log(chalk.green("✓ sync complete"));
  } catch (err: any) {
    console.log(chalk.red(`sync failed: ${err.shortMessage || err.message}`));
  }
}
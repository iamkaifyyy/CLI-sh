import "dotenv/config";
process.env.FORCE_COLOR = "1";
import chalk from "chalk";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { handleCommand } from "./handleCommand";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Serve index.html and any other files from the public/ folder
app.use(express.static(path.join(__dirname, "../public")));

io.on("connection", (socket) => {
  console.log("client connected");
  socket.emit("output", chalk.cyan("Welcome to CLI-sh") + "\r\n" + chalk.green("CLI-sh > "));

  socket.on("input", async (line: string) => {
    const output = await handleCommand(line);
    const formattedOutput = output.replace(/\r?\n/g, "\r\n");
    socket.emit("output", "\r\n" + formattedOutput + "\r\n\r\n" + chalk.green("CLI-sh > "));
  });
});

httpServer.listen(3000, () => {
  console.log("CLI-sh running at http://localhost:3000");
});
import "dotenv/config";
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
  socket.emit("output", "Welcome to CLI-sh\r\nCLI-sh > ");

  socket.on("input", async (line: string) => {
    const output = await handleCommand(line);
    socket.emit("output", "\r\n" + output + "\r\n\r\nCLI-sh > ");
  });
});

httpServer.listen(3000, () => {
  console.log("CLI-sh running at http://localhost:3000");
});
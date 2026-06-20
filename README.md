# CLI-sh

A custom shell built with Node.js and TypeScript. Runs in the terminal and also has a browser-based version using xterm.js and Socket.IO.

## Features

- Built-in commands: `pwd`, `help`, `cd`, `exit` (terminal version)
- Passthrough to real system commands (`ls`, `git status`, `whoami`, etc.) via `execa`
- `git sync` — runs `git pull`, `git add .`, `git commit`, `git push` in sequence
- `ai <question>` — sends a prompt to the Gemini API and prints the response
- `ai explain <file>` — reads a file and asks Gemini to explain it
- Browser version with the same commands, rendered in a terminal UI using xterm.js

## Tech Stack

- Node.js + TypeScript
- `readline` for terminal input
- `chalk` for colored output
- `execa` for running system commands
- `express` + `socket.io` for the browser version
- `xterm.js` for the browser terminal UI
- Gemini API for AI commands

## Project Structure

```
src/
├── commands/
│   ├── ai.ts          AI command logic
│   └── gitSync.ts      git sync command
├── builtins.ts          pwd, cd, help
├── index.ts            terminal entry point (REPL)
├── passthrough.ts       runs real system commands
├── handleCommand.ts     command logic for the browser version
└── server.ts            Express + Socket.IO server
public/
└── index.html           browser terminal UI (xterm.js)
```

## Setup

```bash
git clone <your-repo-url>
cd CLI-sh
npm install
```

Create a `.env` file in the project root:

```
GEMINI_API_KEY=your_api_key_here
```

Get a key at https://aistudio.google.com/apikey

## Usage

**Terminal version:**

```bash
npm start
```

**Browser version:**

```bash
npm run web
```

Then open `http://localhost:3000` in your browser.

## Commands

| Command | Description |
|---|---|
| `pwd` | Print current directory |
| `cd <dir>` | Change directory (terminal version only) |
| `help` | List available commands |
| `git sync` | Pull, add, commit, push in one step |
| `ai <question>` | Ask Gemini a question |
| `ai explain <file>` | Ask Gemini to explain a file |
| `exit` | Quit (terminal version only) |
| anything else | Passed through to the system shell |

## Known Limitations

- No support for quoted arguments (e.g. `ai "explain this"` will split on spaces)
- No piping or shell operators (`|`, `&&`, etc.)
- No command history persistence across restarts
- Browser version doesn't support `cd` or `exit`

## License

MIT
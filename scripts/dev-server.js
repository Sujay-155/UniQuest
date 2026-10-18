const path = require("path");
const { spawn } = require("child_process");

const root = path.join(__dirname, "..");
const python = path.join(root, "server", ".venv", "Scripts", "python.exe");

const child = spawn(
  python,
  ["-m", "uvicorn", "main:app", "--port", "8030", "--app-dir", "server"],
  { cwd: root, stdio: "inherit" }
);

child.on("exit", (code) => process.exit(code ?? 0));

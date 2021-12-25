const readline = require("readline");
export function progressMessage(message: string) {
  readline.cursorTo(process.stdout, 0);
  process.stdout.write(message);
}
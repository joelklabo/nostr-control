import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class FileLogger {
  constructor(prefix, logPath) {
    this.prefix = prefix;
    this.logFilePath = logPath || path.join(__dirname, 'plugin.log');
  }

  log(text) {
    const logText = `${this.prefix} ${text}`;
    this._appendToFile(logText);
    this._logStdOut(logText);
  }

  error(text) {
    const logText = `${this.prefix} [ERROR] ${text}`;
    this._appendToFile(logText);
    this._logStdOut(logText);
  }

  _appendToFile(text) {
    try {
      fs.appendFileSync(this.logFilePath, text + '\n');
    } catch (err) {
      if (err.code === 'ENOENT') {
        // If the file doesn't exist, create it and try again
        fs.writeFileSync(this.logFilePath, '');
        fs.appendFileSync(this.logFilePath, text + '\n');
      } else {
        console.error('Error appending text to the log file:', err);
      }
    }
  }

  _logStdOut(message, level = 'info') {
    const request = {
      jsonrpc: '2.0',
      method: 'log',
      params: {level: level, message: message},
    };
    process.stdout.write(JSON.stringify(request));
  }
}

export default FileLogger;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class FileLogger {
  constructor(prefix, logName = 'debug.log') {
    this.prefix = prefix;
    this.logFilePath = path.join(__dirname, logName);
  }

  log(text) {
    this.appendToFile(`${this.prefix} ${text}`);
  }

  error(text) {
    this.appendToFile(`${this.prefix} [ERROR] ${text}`);
  }

  appendToFile(text) {
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
}

export default FileLogger;

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LEVELS = {
	info: "INFO",
	debug: "DEBUG",
	warn: "WARN",
	error: "ERROR"
}

class FileLogger {

	constructor(prefix, logPath) {
    this.prefix = prefix;
    this.logFilePath = logPath || path.join(__dirname, 'log');
  }

	child(prefix) {
		return new FileLogger(`${this.prefix} ${prefix}`, this.logFilePath)
	}

	logInfo(message) {
		this._log(message, 'info');
	}

	logDebug(message) {
		this._log(message, 'debug');
	}

	logWarn(message) {
		this._log(message, 'warn');
	}

	logError(message) {
		this._log(message, 'error');
	}

  _log(message, level = 'info') {
		let logText;
		// Check the type of the input and handle accordingly
		if (typeof message === 'string') {
			logText = message;
		} else if (typeof message === 'object') {
			// Stringify the object to make it human-readable
			logText = JSON.stringify(message, null, 2);
		} else {
			// If the input is not a string or an object, convert it to a string
			logText = String(message);
		}

    const finalText = `${this.prefix} [${LEVELS[level]}] ${logText}`;

    this._appendToFile(finalText);
    this._logStdOut(logText, level);
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
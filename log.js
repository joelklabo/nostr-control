import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function log(text) {
  const tempFilePath = path.join(__dirname, 'log.txt');

  try {
    fs.appendFileSync(tempFilePath, text + '\n');
  } catch (err) {
    if (err.code === 'ENOENT') {
      // If the file doesn't exist, create it and try again
      fs.writeFileSync(tempFilePath, '');
      fs.appendFileSync(tempFilePath, text + '\n');
    } else {
      console.error('Error appending text to the temporary file:', err);
    }
  }
}

export default log

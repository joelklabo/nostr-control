import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

class ConfigReader {

	constructor(filePath) {
		const __filename = fileURLToPath(import.meta.url);
		const __dirname = dirname(__filename);	
		this.path = path.join(__dirname, filePath)
	}

	read() {
  	try {
  	  const jsonString = fs.readFileSync(this.path, 'utf8');
  	  return JSON.parse(jsonString);
  	} catch (error) {
  	  console.error(error);
  	  return null;
  	}
	}

	write(data) {
  	try {
  	  const dataString = JSON.stringify(data);
  	  fs.writeFileSync(this.path, dataString);
  	} catch (error) {
			console.error(error)
  	}
	}
}

export default ConfigReader
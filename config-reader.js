import fs from 'fs';
import path from 'path';

class ConfigReader {

	constructor(filePath) {
		this.path = path.join(process.cwd(), filePath)
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
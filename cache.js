import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class Cache {
  constructor(fetchFunc, cacheFile = 'cache.json') {
    this.cacheFilePath = path.join(__dirname, cacheFile);
    this.cache = {};
    this.fetchFunc = fetchFunc;

    this._loadCache();
  }

  async _loadCache() {
    try {
      const data = await fs.readFile(this.cacheFilePath, 'utf-8');
      this.cache = JSON.parse(data);
    } catch (err) {
      if (err.code === 'ENOENT') {
        this.cache = {};
      } else {
        throw err;
      }
    }
  }

  async _saveCache() {
    await fs.writeFile(this.cacheFilePath, JSON.stringify(this.cache, null, 2));
  }

  get(key) {
    if (this.cache.hasOwnProperty(key)) {
      return Promise.resolve(this.cache[key]);
    }

    // Return the key immediately and update the cache in the background
    this.fetchFunc(key).then(async (value) => {
      this.cache[key] = value;
      await this._saveCache();
    });

    return Promise.resolve(key);
  }
}

export default Cache;

import net from 'net';
import FileLogger from 'cln-file-logger';

class LightningRpc {
  constructor(socketPath, logger = new FileLogger('[RPC]')) {
    if (!socketPath) {
      throw new Error('The RPC wrapper needs a socket path.');
    }
    this.socketPath = socketPath;
    this.rpc = net.createConnection({ path: this.socketPath });
    this.id = 0;
    this.allowedErrors = 10;
    this.logger = logger;

    this.rpc.on('timeout', async () => {
      this.logger.logWarn('timeout')
      this.rpc.destroy();
      try {
        await this.restoreSocket();
      } catch (e) {
        process.exit();
      }
    });

    this.rpc.on('error', async (e) => {
      this.logger.logError(e)
      if (this.allowedErrors > 0) {
        try {
          await this.restoreSocket();
        } catch (e) {
          process.exit();
        }
      } else {
        throw e;
      }
    });

    this.rpc.on('close', async (hadError) => {
      this.logger.logError(`close with error: ${hadError}`)
      if (hadError === true && this.allowedErrors <= 0) {
        throw new Error('An unexpected failure caused the socket ' + this.socketPath + ' to close.');
      } else {
        this.rpc.destroy();
        try {
          await this.restoreSocket();
        } catch (e) {
          process.exit();
        }
      }
    });

    this.rpc.on('error', async (e) => {
      this.logger.logError(e)
      this.rpc.destroy();
      try {
        await this.restoreSocket();
      } catch (e) {
        process.exit();
      }
    });

    setInterval(() => this.allowedErrors++, 1000 * 60 * 30);

    this.buffer = '';
  }

  async readResponse(chunk, resolve, reject) {
    this.buffer += chunk;
    try {
      const res = JSON.parse(this.buffer);
      this.logger.logInfo('received response');
      this.logger.logInfo(this.buffer);
      this.buffer = '';
      resolve(res);
    } catch (e) {
      this.rpc.once('data', (chunk) => {
        this.readResponse(chunk, resolve, reject);
      });
    }
  }

  async _jsonRpcRequest(data) {
    return new Promise((resolve, reject) => {
      this.rpc.write(data);
      this.rpc.once('data', (chunk) => {
        this.readResponse(chunk, resolve, reject);
      });
    });
  }

  async call(_method, _params) {
    this.logger.logInfo(`calling method: ${_method} with params: ${JSON.stringify(_params)}`);
    _params = _params || {};
    const request = {
      jsonrpc: '2.0',
      id: this.id,
      method: _method,
      params: _params,
    };
    this.logger.logInfo('sending request')
    this.logger.logInfo(request);
  
    const response = await this._jsonRpcRequest(JSON.stringify(request));
    if (response.hasOwnProperty('error')) {
      this.logger.logError('error response')
      this.logger.logError(response.error);
    } else if (!response.hasOwnProperty('result')) {
      this.logger.logError(`<NO RESULT> error response: ${JSON.stringify(response)}`);
    }
  
    return response.result;
  }

  async restoreSocket() {
    this.logger.logInfo('restoring socket');
    return new Promise((resolve, reject) => {
      this.rpc.destroy();
      this.allowedErrors--;
      this.rpc = net.createConnection({ path: this.socketPath });
      this.rpc.on('connect', () => resolve());
      this.rpc.on('error', () => reject());
      this.rpc.on('timeout', () => reject());
    });
  }
}

export default LightningRpc;

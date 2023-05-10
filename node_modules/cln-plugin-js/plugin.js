import LightningRpc from "./rpc.js";
import FileLogger from "cln-file-logger";
import path from "path";

class Plugin {
  constructor(options, logger = new FileLogger('[plugin]')) {
    this.dynamic = options.dynamic || false;
    this.options = [];
    this.methods = [];
    this.subscriptions = {};
    this.methodHandlers = {};
    this.logger = logger;
  }

  addOption = (key, type, description, default_value) => {
    this.options.push({
      name: key,
      type: type,
      description: description,
      default: default_value,
    });
  };

  addMethod = (key, description, usage, handler) => {
    this.logger.logInfo('adding method: ' + key);
    this.methodHandlers[key] = handler;
    this.methods.push({
      name: key,
      description: description,
      usage: usage,
    });
  };

  subscribe = (key, handler) => {
    this.subscriptions[key] = handler;
  };

  init = {};

  // Options

  cli_params = {};

  manifest = () => {
    return {
      dynamic: true,
      options: this.options,
      rpcmethods: this.methods,
      subscriptions: Object.keys(this.subscriptions),
    };
  };

  mainLoop = async () => {
    let chunk;
    let message;

    while ((chunk = process.stdin.read())) {
      const msg = chunk.split("\n\n")[0];

      try {
        message = JSON.parse(msg);
      } catch (err) {
        this.logger.logError("Error parsing JSON:");
        this.logger.logError(err);
      }

      if (!message || !message.method || message.jsonrpc !== "2.0") {
        this.logger.logError("Invalid JSON-RPC 2.0 message");
        break;
      }

      this.logger.logInfo('received message:');
      this.logger.logInfo(message);

      if (this.subscriptions.hasOwnProperty(message.method)) {
        await this.subscriptions[message.method](message.params);
      } else if (this.methodHandlers.hasOwnProperty(message.method)) {
        this.sendResponse(message.id, await this.methodHandlers[message.method](message.params));
      } else {
        await this.handleMessage(message);
      }
    }
  };

  handleMessage = async (message) => {
    const id = message.id;
    const method = message.method;
    switch (method) {
      case "getmanifest":
        this.sendResponse(id, this.manifest());
        break;
      case "init":
        const config = message.params.configuration;
        const rpcPath = path.join(config["lightning-dir"], config["rpc-file"]);
        this.rpc = new LightningRpc(rpcPath, this.logger.child("[RPC]"));
        this.sendResponse(id, this.init);
        break;
    }
  };

  sendResponse = (id, result) => {
    const response = {
      jsonrpc: "2.0",
      id: id,
      result: result,
    };
    this.logger.logInfo('sending response:');
    this.logger.logInfo(response);
    process.stdout.write(JSON.stringify(response) + "\n\n");
  };

  start = () => {
    process.stdin.setEncoding("utf8");
    process.stdin.on("readable", async () => {
      await this.mainLoop();
    });
  };
}

export default Plugin;

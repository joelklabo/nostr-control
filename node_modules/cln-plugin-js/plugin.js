#!/usr/bin/env node
import LightningRpc from "./rpc.js";
import path from "path";
import FileLogger from "./file-logger.js";

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
    this.logger.log('adding method: ' + key);
    this.methodHandlers[key] = handler;
    this.logger.log(JSON.stringify(this.methodHandlers));
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

  testinfo = () => {
    return {
      node_id:
        "029999ce6a1b74cf077f503b81bb4d95af34114363bdac5922a9b353ce0449bac4",
      option: {
        test: this.test,
      },
      cli_params: this.cli_params,
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
        this.logger.error("Error parsing JSON:", err);
      }

      if (!message || !message.method || message.jsonrpc !== "2.0") {
        this.logger.error("Invalid JSON-RPC 2.0 message:", line);
        break;
      }

      this.logger.log('received message:');
      this.logger.log(JSON.stringify(message));

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
        this.rpc = new LightningRpc(path.join(config["lightning-dir"], config["rpc-file"]))
        this.sendResponse(id, this.init);
        break;
    }
  };

  log(message) {
    this.logger.log(message);
  }

  sendResponse = (id, result) => {
    const response = {
      jsonrpc: "2.0",
      id: id,
      result: result,
    };
    this.logger.log('sending response:');
    this.logger.log(JSON.stringify(response));
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

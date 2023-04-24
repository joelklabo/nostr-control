#!/usr/bin/env node
import { sendJsonRpcMessage } from "./rpc.js";
import log from "./log.js";
import path from "path";

class Plugin {
  constructor(options, logger) {
    this.dynamic = options.dynamic || false;
    this.options = [];
    this.methods = [];
    this.subscriptions = {};
    this.logger = logger || log;
  }

  addOption = (key, type, description, default_value) => {
    this.options.push({
      name: key,
      type: type,
      description: description,
      default: default_value,
    });
  };

  addMethod = (key, description, usage) => {
    this.methods.push({
      name: key,
      description: description,
      usage: usage,
    });
  };

  subscribe = (key, handler) => {
    this.subscriptions[key] = handler;
  };

	rpc = async (method, params) => {
		return await sendJsonRpcMessage(this.rpc_path, method, params)
	}

  init = {};

  // Options

  test = "";
  cli_params = {};
  rpc_path = "";

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
      rpc_path: this.rpc_path,
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
        console.error("Error parsing JSON:", err);
      }

      if (!message || !message.method || message.jsonrpc !== "2.0") {
        console.error("Invalid JSON-RPC 2.0 message:", line);
        break;
      }

      this.logger('received message:');
      this.logger(JSON.stringify(message));

      if (this.subscriptions.hasOwnProperty(message.method)) {
        this.subscriptions[message.method](message.params);
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
        this.test = message.params.options.test;
        const config = message.params.configuration;
        this.rpc_path = path.join(config["lightning-dir"], config["rpc-file"]);
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
    this.logger('sending response:');
    this.logger(JSON.stringify(response));
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

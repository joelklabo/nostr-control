import net from 'net';

async function sendJsonRpcMessage(socketPath, method, params = {}) {
  const socket = await new Promise((resolve, reject) => {
    const client = net.connect({ path: socketPath }, () => {
      resolve(client);
    });

    client.on('error', (err) => {
      reject(err);
    });
  });

  const messageId = 1; // You can use a unique ID generator here for concurrent requests
  const jsonRpcRequest = {
    jsonrpc: '2.0',
    id: messageId,
    method: method,
    params: params,
  };

  return new Promise((resolve, reject) => {
    socket.setEncoding('utf8');

    socket.on('data', (data) => {
      try {
        const response = JSON.parse(data);

        if (response.jsonrpc === '2.0' && response.id === messageId) {
          if (response.hasOwnProperty('result')) {
            resolve(response.result);
          } else if (response.hasOwnProperty('error')) {
            reject(response.error);
          }
        }
      } catch (err) {
        reject(err);
      }
    });

    socket.on('error', (err) => {
      reject(err);
    });

    socket.on('end', () => {
      console.log('Socket connection closed');
    });

    socket.write(JSON.stringify(jsonRpcRequest) + '\n');
  });
}

export { sendJsonRpcMessage };

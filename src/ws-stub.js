// Stub for ws module
const WebSocket = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
  Server: function() { return this; },
  WebSocket: function() { return this; },
  WebSocketServer: function() { return this; },
  createServer: function() { return new this.Server(); },
  connect: function() { return new this.WebSocket(); },
};

module.exports = WebSocket;
module.exports.default = WebSocket;

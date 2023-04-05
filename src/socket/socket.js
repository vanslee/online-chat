import { Manager } from "socket.io-client";

class Socket {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.reconnectInterval = null;
    this.reconnectCount = 0;
    this.reconnectMaxCount = 10;
    this.reconnectDelay = 1000;
    this.heartbeatInterval = null;
    this.heartbeatTimeout = null;
    this.heartbeatDelay = 30000;
  }

  connect(url, uid) {
    const manager = new Manager(`${url}?uid=${uid}`, {
      transports: ["websocket", "xhr-polling", "jsonp-polling"],
    });
    this.socket = manager.socket("/");
    this.socket.on("connect", () => {
      console.log("Socket connected");
      this.connected = true;
      this.reconnectCount = 0;
      this.startHeartbeat();
    });

    this.socket.on("disconnect", () => {
      console.log("Socket disconnected");
      this.connected = false;
      this.stopHeartbeat();
    });

    this.socket.on("reconnect", () => {
      console.log("Socket reconnected");
      this.connected = true;
      this.stopReconnect();
      this.startHeartbeat();
    });

    this.socket.on("reconnect_failed", () => {
      console.log("Socket reconnect failed");
      this.connected = false;
      this.stopHeartbeat();
      this.startReconnect();
    });
    this.socket.on("error", (data) => {
      console.log("error", data);
    });
  }

  disconnect() {
    this.stopReconnect();
    this.stopHeartbeat();
    this.socket.disconnect();
  }
  on(event, callback) {
    this.socket.on(event, callback);
  }

  off(event, callback) {
    this.socket.off(event, callback);
  }

  emit(event, data, callback) {
    this.socket.emit(event, data, callback);
  }

  startReconnect() {
    if (this.reconnectInterval) return;

    this.reconnectInterval = setInterval(() => {
      if (this.reconnectCount >= this.reconnectMaxCount) {
        clearInterval(this.reconnectInterval);
        return;
      }

      this.reconnectCount++;
      console.log(
        `Socket reconnecting (${this.reconnectCount}/${this.reconnectMaxCount})`
      );
      this.socket.connect();
    }, this.reconnectDelay);
  }

  stopReconnect() {
    clearInterval(this.reconnectInterval);
    this.reconnectInterval = null;
    this.reconnectCount = 0;
  }

  startHeartbeat() {
    if (this.heartbeatInterval || !this.connected) return;

    this.heartbeatInterval = setInterval(() => {
      this.socket.emit("ping");
      this.heartbeatTimeout = setTimeout(() => {
        this.socket.disconnect();
      }, this.heartbeatDelay);
    }, this.heartbeatDelay);
  }

  stopHeartbeat() {
    clearInterval(this.heartbeatInterval);
    clearTimeout(this.heartbeatTimeout);
    this.heartbeatInterval = null;
    this.heartbeatTimeout = null;
  }
}
const useSocket = (uid) => {
  const socket = new Socket();
  socket.connect("192.168.2.104:9001", uid);
  return socket.socket;
};
export default useSocket;

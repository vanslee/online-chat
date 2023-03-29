import { Manager } from "socket.io-client";
let socketClient = {};
const socketURL = "http://192.168.2.105:9001";
const userId = localStorage.getItem("userId");
const manager = new Manager(`${socketURL}?userId=${userId}`, {
  transports: ["websocket", "xhr-polling", "jsonp-polling"],
});
socketClient = manager.socket("/");

socketClient.on("connect", () => {
  console.log("Connected to server!");
});

socketClient.on("message", (data) => {
  console.log(`Received message: ${data}`);
});

socketClient.emit("chat", "Hello Server!");

export default socketClient;

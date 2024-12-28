import WebSocket from "ws";

let ws: WebSocket | undefined;

const connectToWebSocket = (): void => {
  const wsUrl = import.meta.env.WS_URL || 'wss://sheetbookingsocket.glitch.me';
  if (!wsUrl) {
    console.error("WebSocket URL is not defined");
    return;
  }

  ws = new WebSocket(wsUrl, {
    headers: {
      "user-agent": "API CLIENT",
    },
  });

  ws.on("open", () => {
    console.log("Connected to WebSocket server");
  });

  ws.on("error", (error: Error) => {
    console.error("WebSocket error:", error);
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
};

// const broadcast = (data: unknown): void => {
//   if (!ws || ws.readyState !== WebSocket.OPEN) {
//     console.log("WebSocket is closed. Reconnecting...");
//     connectToWebSocket();

//     setTimeout(() => {
//       if (ws && ws.readyState === WebSocket.OPEN) {
//         ws.send(JSON.stringify(data));
//       } else {
//         console.log("Still unable to connect, please try again later.");
//       }
//     }, 3000);
//   } else {
//     ws.send(JSON.stringify(data));
//   }
// };

connectToWebSocket();

export { connectToWebSocket /* , broadcast */ };

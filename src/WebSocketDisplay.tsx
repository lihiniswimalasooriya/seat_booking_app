import React from "react";
import useWebSocket from "./Utils/useWebSocket";

const WebSocketDisplay: React.FC = () => {
  const { messages, status , finalMessage} = useWebSocket(
    "wss://sheetbookingsocket.glitch.me"
  );

  console.log("messages", finalMessage);
  

  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: "20px" }}>
      <h1>WebSocket Listener</h1>
      <p>
        <strong>Status:</strong> {status}
      </p>
      <div
        style={{
          border: "1px solid #ddd",
          padding: "10px",
          maxWidth: "500px",
          maxHeight: "300px",
          overflowY: "auto",
          backgroundColor: "#f9f9f9",
        }}
      >
        {messages.length === 0 ? (
          <p>
            <em>Waiting for messages...</em>
          </p>
        ) : (
          messages.map((msg: any, index: any) => (
            <div
              key={index}
              style={{
                padding: "5px",
                borderBottom: "1px solid #ddd",
                color: "blue",
                fontWeight: "bold",
              }}
            >
              {msg}
            </div>
          ))
        )}
      </div>

      <div
              style={{
                padding: "5px",
                borderBottom: "1px solid #ddd",
                color: "blue",
                fontWeight: "bold",
              }}
            >
              {finalMessage}
            </div>
    </div>
  );
};

export default WebSocketDisplay;

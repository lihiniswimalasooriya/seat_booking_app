import React, { useState, useEffect, useRef } from "react";

const WebSocketTest: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const addMessage = (text: string) => {
    setMessages((prevMessages) => [...prevMessages, text]);
  };

  useEffect(() => {
    const ws = new WebSocket("wss://sheetbookingsocket.glitch.me");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
      addMessage("Connected to WebSocket server");
      ws.send("Hello, server!");
    };

    ws.onmessage = (event) => {
      console.log("Received:", event.data);
      try {
        const parsedData = JSON.parse(event.data);

        if (parsedData.message) {
          const innerMessage = JSON.parse(parsedData.message);
          addMessage(`Received: ${JSON.stringify(innerMessage, null, 2)}`);
        } else {
          addMessage(`Received: ${JSON.stringify(parsedData, null, 2)}`);
        }
      } catch (error) {
        addMessage(`Received: ${event.data}`);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      addMessage("WebSocket connection closed");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      addMessage("WebSocket error occurred");
    };

    // Cleanup WebSocket connection on component unmount
    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    // Scroll to the latest message
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: "20px" }}>
      <h1>WebSocket Client</h1>
      <div
        id="messages"
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
          messages.map((message, index) => (
            <div
              key={index}
              style={{
                padding: "5px",
                borderBottom: "1px solid #ddd",
                color: message.includes("error") ? "red" : "blue",
                fontWeight: "bold",
              }}
            >
              {message}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default WebSocketTest;

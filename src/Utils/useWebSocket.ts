import { useEffect, useState } from "react";

const isMessageEqual = (jsonString: any, value: any) => {
  return jsonString.includes(`"message":"${value}"`);
};

const useWebSocket = (url: string) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [finalMessage, setFinalMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Connecting...");

  useEffect(() => {
    const ws = new WebSocket(url);

    // WebSocket connection opened
    ws.onopen = () => {
      console.log("Connected to WebSocket server");
      setStatus("Connected");
    };

    // WebSocket message received
    ws.onmessage = (event) => {
      console.log("Received:", event.data);
      if (!isMessageEqual(event.data, "Hello, server!")) {
        setFinalMessage(event.data);
      }
      try {
        // Add the message to the list of messages
        setMessages((prevMessages) => [...prevMessages, event.data]);
      } catch (error) {
        console.error("Error parsing message:", error);
        setMessages((prevMessages) => [...prevMessages, event.data]);
      }
    };

    // WebSocket error handling
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setStatus("Error");
    };

    // WebSocket connection closed
    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setStatus("Disconnected");
    };

    // Cleanup on unmount
    return () => {
      ws.close();
    };
  }, [url]);

  return { messages, finalMessage, status };
};

export default useWebSocket;

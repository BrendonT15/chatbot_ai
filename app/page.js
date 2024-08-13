'use client'
import { Box, Stack, TextField, Button, Typography } from "@mui/material";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [history, setHistory] = useState([]);
  const firstMessage = "Hi there! I'm the Headstarter virtual assistant. How can I help?";
  
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);

    // Add the user's message to history
    setHistory((history) => [
      ...history,
      { role: "user", parts: [{ text: message }] }
    ]);
    setMessage("");

    // Send the user's message to the server
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([
        ...history,
        { role: "user", parts: [{ text: message }] }
      ]),
    });

    const data = await response.json();

    // Assuming data is an object with a 'text' property or is a string
    const modelResponse = typeof data === 'string' ? data : data.text;

    // Add the model's response to history
    setHistory((history) => [
      ...history,
      { role: "model", parts: [{ text: modelResponse }] }
    ]);

    setIsLoading(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        direction={'column'}
        width="500px"
        height="700px"
        border="1px solid black"
        p={2}
        spacing={3}
      >
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          <Typography 
                bgcolor ="primary.main"
                display="flex"
                justifyContent="flex-start"
                color="white"
                borderRadius={16}
                p={3}>{firstMessage}</Typography>
          {history.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'user' ? 'flex-end' : 'flex-start'
              }
            >
              <Box
                bgcolor={
                  message.role === 'user'
                    ? 'secondary.main'
                    : 'primary.main'
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.parts[0].text}
              </Box>
            </Box>
          ))}

          <div ref={messagesEndRef} />
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ChatBot.css";

function ChatBot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi! I'm AI LogPulse Assistant. Ask me anything.",
    },
  ]);

  const bottomRef = useRef(null);

  // -------------------------------
  // Load chat history
  // -------------------------------
  useEffect(() => {
    const saved = localStorage.getItem("chat_history");

    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  // -------------------------------
  // Save chat history
  // -------------------------------
  useEffect(() => {
    localStorage.setItem(
      "chat_history",
      JSON.stringify(messages)
    );
  }, [messages]);

  // -------------------------------
  // Auto scroll
  // -------------------------------
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // -------------------------------
  // Clear Chat
  // -------------------------------
  const newChat = () => {
    setMessages([
      {
        sender: "bot",
        text: "👋 Hi! I'm AI LogPulse Assistant. Ask me anything.",
      },
    ]);
  };

  // -------------------------------
  // Send Message
  // -------------------------------
  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      sender: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentMessage = message;

    setMessage("");

    setLoading(true);

    try {
      const response = await axios.post(
        "https://ai-logpulse.onrender.com/chat",
        {
          message: currentMessage,
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: response.data.reply,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            "❌ Unable to connect to AI server. Please try again.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}

      <button
        className="chat-toggle"
        onClick={() => setOpen(!open)}
      >
        💬
      </button>

      {/* Chat Window */}

      {open && (
        <div className="chat-window">

          {/* Header */}

          <div className="chat-header">

            <div>

              <h3>🤖 AI LogPulse Assistant</h3>

              <small>
                Powered by Gemini 2.5 Flash
              </small>

            </div>

            <button
              className="new-chat-btn"
              onClick={newChat}
            >
              New Chat
            </button>

          </div>

          {/* Messages */}

          <div className="chat-body">

            {messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.sender === "user"
                    ? "user-message"
                    : "bot-message"
                }
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="bot-message typing">
                🤖 AI is thinking...
              </div>
            )}

            <div ref={bottomRef}></div>

          </div>
                    {/* Input Area */}

          <div className="chat-input">

            <input
              type="text"
              placeholder="Ask anything..."
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />

            <button
              className="send-btn"
              onClick={sendMessage}
            >
              ➤
            </button>

          </div>

        </div>
      )}

    </>
  );
}

export default ChatBot;
import { useState } from "react";
import axios from "axios";
import "./ChatBot.css";

function ChatBot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi! I'm AI LogPulse Assistant. Ask me anything.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      sender: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
const res = await axios.post(
  "https://ai-logpulse.onrender.com/chat",
  {
    message,
  }
);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: res.data.reply,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "❌ Backend is not reachable.",
        },
      ]);
    }

    setMessage("");
    setLoading(false);
  };

  return (
    <>
      <button
  className="chat-toggle"
  onClick={() => setOpen(!open)}
  style={{
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "80px",
    height: "80px",
    background: "red",
    color: "white",
    fontSize: "30px",
    zIndex: 99999,
    borderRadius: "50%",
    border: "none"
  }}
>
  💬
</button>

      {open && (
        <div className="chat-window">

          <div className="chat-header">
            AI LogPulse Assistant
          </div>

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
              <div className="bot-message">
                Thinking...
              </div>
            )}

          </div>

          <div className="chat-input">

            <input
              type="text"
              placeholder="Ask anything..."
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={(e) =>
                e.key === "Enter" && sendMessage()
              }
            />

            <button onClick={sendMessage}>
              ➤
            </button>

          </div>

        </div>
      )}
    </>
  );
}

export default ChatBot;
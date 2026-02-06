import React, { useEffect, useState, useRef } from "react";
import { Button, Input, List, Typography, Space, Spin, Popconfirm } from "antd";
import { SendOutlined, CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import { queryChatBot, clearChat } from "../api";
import ReactMarkdown from "react-markdown";

const { TextArea } = Input;
const { Text } = Typography;
const initialMessage = [
  {
    id: 1,
    text: "Hello! I'm your AI assistant, built to help you navigate PyTC Client. How can I help you today?",
    isUser: false,
  },
];

function Chatbot({ onClose }) {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatMessages");
    return saved ? JSON.parse(saved) : initialMessage;
  });
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const lastMessageRef = useRef(null);

  const scrollToLastMessage = () => {
    setTimeout(() => {
      if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 0);
  };

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    scrollToLastMessage();
  }, [messages, isSending]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isSending) return;
    const query = inputValue;
    setInputValue("");
    const userMessage = { id: messages.length + 1, text: query, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setIsSending(true);
    try {
      const responseText = await queryChatBot(query);
      const botMessage = {
        id: userMessage.id + 1,
        text: responseText || "Sorry, I could not generate a response.",
        isUser: false,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: e.message || "Error contacting chatbot.",
          isUser: false,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = async () => {
    try {
      await clearChat();
      setMessages(initialMessage);
      localStorage.setItem("chatMessages", JSON.stringify(initialMessage));
    } catch (e) {
      console.error("Failed to clear chat:", e);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text strong>AI Assistant</Text>
        <Space>
          <Popconfirm
            title="Clear chat history"
            onConfirm={handleClearChat}
            okText="Clear"
            cancelText="Cancel"
          >
            <Button type="text" icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={onClose}
            size="small"
          />
        </Space>
      </div>
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "16px",
        }}
      >
        <List
          dataSource={messages}
          renderItem={(message, index) => {
            const isLastMessage = index === messages.length - 1;
            return (
              <List.Item
                ref={isLastMessage ? lastMessageRef : null}
                style={{
                  border: "none",
                  padding: "8px 0",
                  justifyContent: message.isUser ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "8px 12px",
                    borderRadius: "12px",
                    backgroundColor: message.isUser ? "#1890ff" : "#f5f5f5",
                    color: message.isUser ? "white" : "black",
                  }}
                >
                  {message.isUser ? (
                    <Text style={{ color: "white" }}>{message.text}</Text>
                  ) : (
                    <ReactMarkdown
                      components={{
                        ul: ({ children }) => (
                          <ul style={{ paddingLeft: "20px", margin: "8px 0" }}>
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol style={{ paddingLeft: "20px", margin: "8px 0" }}>
                            {children}
                          </ol>
                        ),
                        table: ({ children }) => (
                          <div style={{ overflowX: "auto", margin: "8px 0" }}>
                            <table
                              style={{
                                borderCollapse: "collapse",
                                width: "100%",
                                fontSize: "13px",
                              }}
                            >
                              {children}
                            </table>
                          </div>
                        ),
                        thead: ({ children }) => (
                          <thead style={{ backgroundColor: "#e8e8e8" }}>
                            {children}
                          </thead>
                        ),
                        th: ({ children }) => (
                          <th
                            style={{
                              border: "1px solid #ddd",
                              padding: "6px 8px",
                              textAlign: "left",
                              fontWeight: 600,
                            }}
                          >
                            {children}
                          </th>
                        ),
                        td: ({ children }) => (
                          <td
                            style={{
                              border: "1px solid #ddd",
                              padding: "6px 8px",
                            }}
                          >
                            {children}
                          </td>
                        ),
                        code: ({ inline, children }) =>
                          inline ? (
                            <code
                              style={{
                                backgroundColor: "#e8e8e8",
                                padding: "2px 4px",
                                borderRadius: "3px",
                                fontSize: "12px",
                              }}
                            >
                              {children}
                            </code>
                          ) : (
                            <pre
                              style={{
                                backgroundColor: "#1e1e1e",
                                color: "#d4d4d4",
                                padding: "8px",
                                borderRadius: "4px",
                                overflowX: "auto",
                                fontSize: "12px",
                                margin: "8px 0",
                              }}
                            >
                              <code>{children}</code>
                            </pre>
                          ),
                        pre: ({ children }) => <>{children}</>,
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                  )}
                </div>
              </List.Item>
            );
          }}
        />
        {isSending && <Spin size="small" />}
      </div>
      <div style={{ padding: "16px" }}>
        <Space.Compact style={{ width: "100%" }}>
          <TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            autoSize={{ minRows: 1, maxRows: 3 }}
          />
          <Button
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isSending}
          />
        </Space.Compact>
      </div>
    </div>
  );
}

export default Chatbot;

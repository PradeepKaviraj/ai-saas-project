"use client";

import { useChat } from "@/context/ChatContext";

export default function Sidebar() {
  const {
    chats,
    selectedChatId,
    setMessages,
    setSelectedChatId,
    startNewChat,
  } = useChat();

  return (
    <div style={{
      width: "260px",
      height: "100vh",
      background: "#0f0f0f",
      borderRight: "1px solid #1f1f1f",
      display: "flex",
      flexDirection: "column",
      padding: "16px",
      gap: "8px",
    }}>

      {/* LOGO */}
      <div style={{
        fontSize: "18px",
        fontWeight: "bold",
        color: "white",
        padding: "8px 4px",
        marginBottom: "8px",
      }}>
        ⚡ AI SaaS
      </div>

      {/* NEW CHAT */}
      <button
        onClick={startNewChat}
        style={{
          padding: "10px",
          borderRadius: "8px",
          background: "#2563eb",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontWeight: "600",
          fontSize: "14px",
          marginBottom: "8px",
        }}
      >
        + New Chat
      </button>

      {/* LABEL */}
      <p style={{
        fontSize: "11px",
        color: "#555",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        padding: "0 4px",
      }}>
        Chat History
      </p>

      {/* CHAT LIST */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", overflowY: "auto" }}>
        {chats.length === 0 && (
          <p style={{ fontSize: "13px", color: "#444", padding: "8px 4px" }}>
            No chats yet
          </p>
        )}

        {chats.filter((chat) => chat?.id).map((chat) => (
          <div
            key={chat.id}
            onClick={() => {
              setMessages(chat.messages);
              setSelectedChatId(chat.id);
            }}
            style={{
              padding: "10px 12px",
              cursor: "pointer",
              borderRadius: "8px",
              fontSize: "13px",
              color: selectedChatId === chat.id ? "white" : "#aaa",
              background: selectedChatId === chat.id ? "#1d4ed8" : "transparent",
              border: `1px solid ${selectedChatId === chat.id ? "#2563eb" : "#1f1f1f"}`,
              transition: "all 0.15s ease",
            }}
          >
            {(() => {
              const firstUserMsg = chat.messages?.find((m: any) => m.role === "user");
              const title = firstUserMsg?.content || "New Chat";
              return title.length > 28 ? title.slice(0, 28) + "..." : title;
            })()}
          </div>
        ))}
      </div>
    </div>
  );
}
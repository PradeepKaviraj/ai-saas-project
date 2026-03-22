"use client";

import { useState } from "react";
import { useChat } from "@/context/ChatContext";
import { deleteChat } from "@/services/chatService";
import { getChatTitle } from "@/features/dashboard/chatHelpers";

export default function Sidebar() {
  const {
    chats, setChats,
    selectedChatId,
    setMessages, setSelectedChatId,
    startNewChat,
  } = useChat();

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);

  const handleDeleteConfirm = async () => {
    if (!confirmDeleteId) return;

    const success = await deleteChat(confirmDeleteId);

    if (success) {
      const updated = chats.filter((c) => c.id !== confirmDeleteId);
      setChats(updated);

      if (selectedChatId === confirmDeleteId) {
        startNewChat();
      }
    }

    setConfirmDeleteId(null);
  };

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
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        overflowY: "auto",
      }}>
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
            onMouseEnter={() => setHoveredChatId(chat.id)}
            onMouseLeave={() => setHoveredChatId(null)}
            style={{
              padding: "10px 12px",
              cursor: "pointer",
              borderRadius: "8px",
              fontSize: "13px",
              color: selectedChatId === chat.id ? "white" : "#aaa",
              background: selectedChatId === chat.id ? "#1d4ed8" : "transparent",
              border: `1px solid ${selectedChatId === chat.id ? "#2563eb" : "#1f1f1f"}`,
              transition: "all 0.15s ease",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {/* TITLE */}
            <span style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
              fontSize: "13px",
            }}>
              💬 {getChatTitle(chat)}
            </span>

            {/* DELETE BUTTON — only show on hover */}
            {hoveredChatId === chat.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDeleteId(chat.id);
                }}
                title="Delete chat"
                style={{
                  background: "transparent",
                  border: "1px solid #7f1d1d",
                  color: "#ef4444",
                  cursor: "pointer",
                  fontSize: "11px",
                  padding: "3px 7px",
                  borderRadius: "4px",
                  flexShrink: 0,
                  fontWeight: "600",
                  transition: "all 0.15s",
                }}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

      {/* CONFIRM DELETE POPUP */}
      {confirmDeleteId && (
        <>
          {/* BACKDROP */}
          <div
            onClick={() => setConfirmDeleteId(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              zIndex: 100,
            }}
          />

          {/* MODAL */}
          <div style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: "12px",
            padding: "28px 32px",
            zIndex: 101,
            width: "320px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
          }}>

            {/* ICON */}
            <div style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "#7f1d1d33",
              border: "1px solid #7f1d1d",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
            }}>
              🗑️
            </div>

            <div>
              <h3 style={{
                color: "white",
                fontSize: "16px",
                fontWeight: "600",
                margin: "0 0 6px 0",
              }}>
                Delete Chat?
              </h3>
              <p style={{
                color: "#666",
                fontSize: "13px",
                margin: 0,
                lineHeight: "1.5",
              }}>
                This chat will be permanently deleted. This action cannot be undone.
              </p>
            </div>

            {/* BUTTONS */}
            <div style={{
              display: "flex",
              gap: "10px",
              marginTop: "4px",
            }}>
              <button
                onClick={() => setConfirmDeleteId(null)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "8px",
                  background: "transparent",
                  color: "#aaa",
                  border: "1px solid #2a2a2a",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteConfirm}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "8px",
                  background: "#dc2626",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
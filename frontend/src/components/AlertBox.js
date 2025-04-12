// components/AlertBox.js
import React from "react";

const AlertBox = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        backgroundColor: type === "error" ? "#f44336" : "#4CAF50",
        color: "white",
        padding: "10px 20px",
        borderRadius: "4px",
        boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
      }}
    >
      {message}
      <button
        onClick={onClose}
        style={{
          marginLeft: "15px",
          background: "transparent",
          color: "white",
          border: "none",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        ×
      </button>
    </div>
  );
};

export default AlertBox;

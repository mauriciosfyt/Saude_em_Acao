import React from "react";

const defaultStyle = {
  color: "red", // vermelho padrão (bootstrap danger)
  marginTop: 8,
  fontSize: "0.9rem",
  textAlign: "center",
};

export default function ErrorMessage({ message, style, role = "alert" }) {
  if (!message) return null;
  return (
    <p style={{ ...defaultStyle, ...(style || {}) }} role={role}>
      {message}
    </p>
  );
}

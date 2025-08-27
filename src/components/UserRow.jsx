import React, { memo } from "react";

function UserRowBase({ user, active, onClick }) {
  return (
    <li
      onClick={onClick}
      style={{
        padding: "10px 12px",
        border: "1px solid #eee",
        borderRadius: 10,
        cursor: "pointer",
        background: active ? "#eef6ff" : "#fff",
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div>
        <div style={{ fontWeight: 600 }}>{user.name}</div>
        <div style={{ color: "#555", fontSize: 13 }}>@{user.username}</div>
      </div>
      <div style={{ color: "#666", fontSize: 12 }}>{user.email}</div>
    </li>
  );
}

export default memo(UserRowBase, (prev, next) =>
  prev.user.id === next.user.id &&
  prev.active === next.active &&
  prev.user.name === next.user.name &&
  prev.user.username === next.user.username &&
  prev.user.email === next.user.email
);

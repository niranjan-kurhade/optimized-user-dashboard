import React, { memo } from "react";
import UserRow from "./UserRow.jsx";

function UserListBase({ users, onSelect, selectedId }) {
  return (
    <div style={styles.card}>
      <h3 style={{ marginTop: 0 }}>Users ({users.length})</h3>
      {users.length === 0 ? (
        <div style={{ padding: 12, color: "#666" }}>No users match your search.</div>
      ) : (
        <ul style={styles.list}>
          {users.map((u) => (
            <UserRow
              key={u.id}
              user={u}
              active={u.id === selectedId}
              onClick={() => onSelect(u.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  card: { background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" },
  list: { listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 },
};

const UserList = memo(UserListBase);
export default UserList;

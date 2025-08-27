import React, { memo } from "react";

function SearchBarBase({ value, onChange }) {
  return (
    <div style={styles.card}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name, username, or email…"
        style={styles.input}
      />
    </div>
  );
}

const styles = {
  card: { background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" },
  input: { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", outline: "none" },
};

export default memo(SearchBarBase);

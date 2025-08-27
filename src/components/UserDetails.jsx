import React, { memo, useMemo } from "react";
import useSWR from "swr";

const USERS_API = "https://jsonplaceholder.typicode.com/users";

function UserDetailsBase({ userId }) {
  // Empty state
  if (!userId) {
    return (
      <div style={styles.card}>
        <h3 style={{ marginTop: 0 }}>User Details</h3>
        <div style={{ color: "#666" }}>Select a user to see details.</div>
      </div>
    );
  }

  // Fetch detail with Suspense
  const { data: user } = useSWR(`/api/users/${userId}`, () =>
    fetch(`${USERS_API}/${userId}`).then(r => r.json()),
    { suspense: true }
  );

  const addressLine = useMemo(() => {
    const a = user.address || {};
    return [a.suite, a.street, a.city, a.zipcode].filter(Boolean).join(", ");
  }, [user.address]);

  return (
    <div style={styles.card}>
      <h3 style={{ marginTop: 0 }}>User Details</h3>
      <div style={styles.row}><strong>Name:</strong> <span>{user.name}</span></div>
      <div style={styles.row}><strong>Username:</strong> <span>@{user.username}</span></div>
      <div style={styles.row}><strong>Email:</strong> <span>{user.email}</span></div>
      <div style={styles.row}><strong>Phone:</strong> <span>{user.phone}</span></div>
      <div style={styles.row}><strong>Website:</strong> <a href={`https://${user.website}`} target="_blank" rel="noreferrer">{user.website}</a></div>
      <div style={styles.row}><strong>Company:</strong> <span>{user.company?.name}</span></div>
      <div style={styles.row}><strong>Address:</strong> <span>{addressLine}</span></div>
    </div>
  );
}

const styles = {
  card: { background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" },
  row: { display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, marginBottom: 8, alignItems: "center" },
};

export default memo(UserDetailsBase);

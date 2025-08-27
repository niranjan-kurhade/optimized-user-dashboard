import React, { memo } from "react";

function PaginationBase({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const go = (p) => {
    const clamped = Math.min(Math.max(1, p), totalPages);
    if (clamped !== page) onChange(clamped);
  };

  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  return (
    <div style={styles.wrap}>
      <button style={styles.btn} onClick={() => go(page - 1)} disabled={page === 1}>Prev</button>
      <div style={styles.pages}>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => go(p)}
            style={{ ...styles.page, ...(p === page ? styles.active : {}) }}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        ))}
      </div>
      <button style={styles.btn} onClick={() => go(page + 1)} disabled={page === totalPages}>Next</button>
    </div>
  );
}

const styles = {
  wrap: { display: "flex", gap: 8, alignItems: "center" },
  btn: { padding: "8px 12px", border: "1px solid #ddd", background: "#fff", borderRadius: 8, cursor: "pointer" },
  pages: { display: "flex", gap: 6 },
  page: { padding: "8px 10px", border: "1px solid #ddd", background: "#fff", borderRadius: 8, cursor: "pointer", minWidth: 36 },
  active: { background: "#111827", color: "#fff", borderColor: "#111827" },
};

export default memo(PaginationBase);

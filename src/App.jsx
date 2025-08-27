import React, { useCallback, useMemo, useState, Suspense, lazy } from "react";
import useSWR, { useSWRConfig } from "swr";

const AddUserForm = lazy(() => import("./components/AddUserForm.jsx"));
const UserList = lazy(() => import("./components/UserList.jsx"));
const UserDetails = lazy(() => import("./components/UserDetails.jsx"));
const SearchBar = lazy(() => import("./components/SearchBar.jsx"));
const Pagination = lazy(() => import("./components/Pagination.jsx"));

const USERS_API = "https://jsonplaceholder.typicode.com/users";
const USERS_KEY = "/api/users";

export default function App() {
  const { cache, mutate } = useSWRConfig();
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const { data: serverUsers } = useSWR(USERS_KEY, () => fetch(USERS_API).then(r => r.json()), { suspense: true });

  const localUsers = cache.get(USERS_KEY + ":local") || [];

  const allUsers = useMemo(() => [...localUsers, ...(serverUsers || [])], [localUsers, serverUsers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allUsers;
    return allUsers.filter(u =>
      (u.name || "").toLowerCase().includes(q) ||
      (u.username || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q)
    );
  }, [allUsers, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const handleSelect = useCallback((id) => setSelectedId(id), []);
  const handleSearch = useCallback((val) => {
    setQuery(val);
    setPage(1);
  }, []);
  const handlePageChange = useCallback((p) => setPage(p), []);
  const handleCreate = useCallback(async (newUser) => {
    const optimistic = { ...newUser, id: Date.now() };
    const prevLocal = cache.get(USERS_KEY + ":local") || [];
    cache.set(USERS_KEY + ":local", [optimistic, ...prevLocal]);
    mutate(USERS_KEY, undefined, false); 

    try {
      const res = await fetch(USERS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const created = await res.json();
      const updatedLocal = [ { ...optimistic, ...created }, ...prevLocal ];
      cache.set(USERS_KEY + ":local", updatedLocal);
      mutate(USERS_KEY, undefined, false);
    } catch (e) {
      cache.set(USERS_KEY + ":local", prevLocal);
      mutate(USERS_KEY, undefined, false);
      alert("Failed to add user.");
    }
  }, [cache, mutate]);

  return (
    <div style={styles.wrap}>
      <header style={styles.header}>
        <h1 style={{ margin: 0 }}>Optimized User Dashboard</h1>
      </header>

      <div style={styles.grid}>
        <section style={styles.left}>
          <Suspense fallback={<Skeleton title="Add User" height={200} />}>
            <AddUserForm onCreate={handleCreate} />
          </Suspense>

          <div style={{ marginTop: 16 }} />
          <Suspense fallback={<Skeleton title="Search" height={60} />}>
            <SearchBar value={query} onChange={handleSearch} />
          </Suspense>

          <div style={{ marginTop: 12 }} />
          <Suspense fallback={<Skeleton title="Users" height={320} />}>
            <UserList users={paged} onSelect={handleSelect} selectedId={selectedId} />
          </Suspense>

          <div style={{ marginTop: 12 }} />
          <Suspense fallback={<Skeleton title="Pagination" height={52} />}>
            <Pagination page={currentPage} totalPages={totalPages} onChange={handlePageChange} />
          </Suspense>
        </section>

        <section style={styles.right}>
          <Suspense fallback={<Skeleton title="User Details" height={420} />}>
            <UserDetails userId={selectedId} />
          </Suspense>
        </section>
      </div>
    </div>
  );
}

function Skeleton({ title, height }) {
  return (
    <div style={{ ...styles.card, minHeight: height, justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: "100%" }}>
        <div style={{ height: 14, width: 120, background: "#eee", borderRadius: 6, marginBottom: 12 }} />
        <div style={{ height: 10, width: "100%", background: "#f3f3f3", borderRadius: 6 }} />
      </div>
      <span style={{ position: "absolute", top: 12, left: 16, color: "#888" }}>{title}</span>
    </div>
  );
}

const styles = {
  wrap: { maxWidth: 1100, margin: "0 auto", padding: 20 },
  header: { marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" },
  grid: { display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16, alignItems: "start" },
  left: {},
  right: {},
  card: { position: "relative", background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 16, display: "flex", gap: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" },
};

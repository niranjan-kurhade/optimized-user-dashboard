import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { SWRConfig } from "swr";

const fetcher = (...args) => fetch(...args).then((res) => {
  if (!res.ok) throw new Error("Network error");
  return res.json();
});

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SWRConfig value={{ fetcher, suspense: true, revalidateOnFocus: false }}>
      <Suspense fallback={<div style={{ padding: 24 }}>Loading app…</div>}>
        <App />
      </Suspense>
    </SWRConfig>
  </React.StrictMode>
);

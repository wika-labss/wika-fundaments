import { useEffect, useState } from "react";
import type { Owner } from "@wika-studio/wika-client";
import { studioApi } from "./api";
import { LoginPage } from "./components/LoginPage";
import { Workspace } from "./components/Workspace";

export function App() {
  const [owner, setOwner] = useState<Owner | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    studioApi
      .me()
      .then((r) => setOwner(r.owner))
      .catch(() => setOwner(null))
      .finally(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <main className="login">
        <p>Cargando…</p>
      </main>
    );
  }

  if (!owner) {
    return <LoginPage onLoggedIn={() => void studioApi.me().then((r) => setOwner(r.owner))} />;
  }

  return <Workspace owner={owner} onLogout={() => setOwner(null)} />;
}

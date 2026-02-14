import { useEffect, useState } from "react";

interface ExtensionUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export function Options() {
  const [user, setUser] = useState<ExtensionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await chrome.runtime.sendMessage({
        type: "GET_POPUP_STATE",
      });
      if (!response?.ok) {
        throw new Error(response?.error ?? "Failed to read extension state");
      }
      setUser((response.payload?.user as ExtensionUser | null) ?? null);
    } catch (refreshError) {
      setError(
        refreshError instanceof Error ? refreshError.message : "Unknown error",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl p-6">
      <h1 className="text-2xl font-semibold">
        Reading List Extension Settings
      </h1>
      <p className="mt-2 text-sm text-zinc-400">
        Manage your account and open the full web app dashboard.
      </p>

      {loading ? (
        <p className="mt-4 text-sm text-zinc-400">Loading account...</p>
      ) : null}

      {error ? (
        <p className="mt-4 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      {!loading ? (
        <section className="mt-6 rounded-xl border border-zinc-700 bg-zinc-900 p-4">
          {user ? (
            <div className="space-y-3">
              <p className="text-sm text-zinc-200">
                Signed in as{" "}
                <strong>
                  {user.email ?? user.displayName ?? "Unknown user"}
                </strong>
              </p>
              <button
                className="rounded-md bg-zinc-800 px-4 py-2 text-sm text-zinc-100 hover:bg-zinc-700"
                onClick={async () => {
                  await chrome.runtime.sendMessage({ type: "SIGN_OUT" });
                  await refresh();
                }}
                type="button"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-zinc-200">
                You are currently signed out.
              </p>
              <button
                className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400"
                onClick={async () => {
                  await chrome.runtime.sendMessage({ type: "SIGN_IN" });
                  await refresh();
                }}
                type="button"
              >
                Sign in with Google
              </button>
            </div>
          )}
        </section>
      ) : null}

      <section className="mt-6">
        <button
          className="rounded-md bg-zinc-800 px-4 py-2 text-sm text-zinc-100 hover:bg-zinc-700"
          onClick={async () => {
            await chrome.runtime.sendMessage({ type: "OPEN_WEB_APP" });
          }}
          type="button"
        >
          Open Full Reading List App
        </button>
      </section>
    </main>
  );
}

import { useEffect, useState } from "react";
import { ChevronDown, UserCog, Check } from "lucide-react";
import { USER_DIRECTORY, getCurrentUser, setCurrentUser, subscribe } from "../lib/currentUser";

/**
 * Walks the signed-in identity between approval stations.
 *
 * The procurement workflows deliberately refuse to let one person approve their
 * own work — a coordinator cannot accept their own deliverable, and the
 * supervisor sign-off must come from someone other than the reviewer. Doing an
 * end-to-end run in a single browser session therefore needs a way to change
 * who you are, which is what this provides.
 */
export function RoleSwitcher() {
  const [open, setOpen] = useState(false);
  const [, force] = useState(0);

  useEffect(() => subscribe(() => force((n) => n + 1)), []);
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [open]);

  const user = getCurrentUser();

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/25 text-white/90 hover:bg-white/10 transition-colors text-sm"
        title="Switch the acting user to move a request through its approval stations"
      >
        <UserCog className="size-4" />
        <span className="hidden sm:inline">
          {user.name} <span className="text-white/60">· {user.roles[0]}</span>
        </span>
        <ChevronDown className="size-3.5" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-lg z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-sm font-medium text-slate-900">Acting as</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Approval gates are enforced per role, and no one may approve their own submission.
            </p>
          </div>
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
            {USER_DIRECTORY.map((u) => {
              const active = u.id === user.id;
              return (
                <button
                  key={u.id}
                  onClick={() => {
                    setCurrentUser(u.id);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex items-start gap-3 ${
                    active ? "bg-emerald-50/60" : ""
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900">{u.name}</p>
                    <p className="text-xs text-slate-500">{u.jobTitle} · {u.department}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {u.roles.map((r) => (
                        <span key={r} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                  {active && <Check className="size-4 text-emerald-600 shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

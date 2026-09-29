/* ═══════════════════════════════════════════════════════════════════════════
   PASSWORD GATE FOR THE CLAIMFOX PAGES

   Vercel Routing Middleware: runs at the edge before any static file is
   served, so the gate holds even for someone requesting a zip or a JS chunk
   directly. Everything else on workshopfiles.com passes straight through.

   Gated: /claimfox*, /fig, /images/claimfox/*, /assets/claimfox-*.js (the
   ClaimFox decks are code-split into their own chunks in App.tsx for this).

   The password lives in the Vercel env var CLAIMFOX_PASSWORD, never in the
   client bundle. A correct entry sets an HttpOnly cookie holding a SHA-256 of
   the password, so changing the env var logs everyone out. If the env var is
   missing the gate fails closed.
   ═══════════════════════════════════════════════════════════════════════════ */

const COOKIE = "cf_access";
const LOGIN_PATH = "/claimfox-login";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function isGated(pathname: string): boolean {
  const p = pathname.toLowerCase();
  return (
    p.startsWith("/claimfox") ||
    /^\/fig(\.html)?\/?$/.test(p) ||
    p.startsWith("/images/claimfox/") ||
    p.startsWith("/assets/claimfox")
  );
}

async function tokenFor(password: string): Promise<string> {
  const bytes = new TextEncoder().encode(`claimfox-gate:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get("cookie") || "";
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return v.join("=");
  }
  return null;
}

function safeNext(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return "/claimfox";
  if (next.toLowerCase().startsWith(LOGIN_PATH)) return "/claimfox";
  return next;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function loginPage(next: string, error: boolean, status = 401): Response {
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>ClaimFox Build Day</title>
<style>
:root{--bg:#F5F1EA;--card:#fff;--ink:#1E2230;--muted:#5E6472;--rule:#DED8CC;--accent:#2F3A8F;--err:#A23B2A}
@media (prefers-color-scheme:dark){:root{--bg:#15171E;--card:#1E2129;--ink:#ECEAE4;--muted:#A3A7B2;--rule:#333745;--accent:#8C97F0;--err:#F08A76}}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:grid;place-items:center;background:var(--bg);color:var(--ink);font:17px/1.6 -apple-system,"Segoe UI",Helvetica,Arial,sans-serif;padding:16px}
form{width:100%;max-width:380px;background:var(--card);border:1px solid var(--rule);border-radius:14px;padding:32px 28px;display:flex;flex-direction:column;gap:14px}
.eyebrow{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);font-weight:600}
h1{margin:0;font-size:24px;line-height:1.25}
p{margin:0;color:var(--muted);font-size:15px}
label{font-size:14px;font-weight:600}
input{font:inherit;padding:11px 12px;border:1px solid var(--rule);border-radius:8px;background:var(--bg);color:var(--ink);width:100%}
input:focus{outline:2px solid var(--accent);outline-offset:1px}
button{font:inherit;font-weight:600;padding:11px;border:0;border-radius:8px;background:var(--accent);color:#fff;cursor:pointer}
.err{color:var(--err);font-size:14px}
</style></head><body>
<form method="post" action="${LOGIN_PATH}">
  <div class="eyebrow">AdVenture Media · ClaimFox</div>
  <h1>Build Day materials</h1>
  <p>Enter the password to open the workbook and files.</p>
  ${error ? '<div class="err" role="alert">That password didn\'t work. Try again.</div>' : ""}
  <label for="pw">Password</label>
  <input id="pw" name="password" type="password" autocomplete="current-password" autofocus required>
  <input type="hidden" name="next" id="next" value="${escapeHtml(next)}">
  <button type="submit">Open</button>
</form>
<script>
  // Keep the #section a person was sent to; the server never sees the hash.
  var n = document.getElementById("next");
  if (location.pathname.toLowerCase() !== "${LOGIN_PATH}") n.value = location.pathname + location.search + location.hash;
  else if (location.hash && n.value.indexOf("#") < 0) n.value += location.hash;
</script>
</body></html>`;
  return new Response(html, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex",
    },
  });
}

export default async function middleware(request: Request): Promise<Response | undefined> {
  const url = new URL(request.url);
  if (!isGated(url.pathname)) return undefined;

  const password = process.env.CLAIMFOX_PASSWORD;
  if (!password) return new Response("Not available.", { status: 503, headers: { "cache-control": "no-store" } });
  const expected = await tokenFor(password);

  if (url.pathname.toLowerCase() === LOGIN_PATH) {
    if (request.method !== "POST") return loginPage(safeNext(url.searchParams.get("next")), false, 200);
    let entered = "";
    let next = "/claimfox";
    try {
      const form = await request.formData();
      entered = String(form.get("password") ?? "");
      next = safeNext(String(form.get("next") ?? ""));
    } catch {
      return loginPage(next, true);
    }
    if ((await tokenFor(entered)) !== expected) return loginPage(next, true);
    return new Response(null, {
      status: 303,
      headers: {
        location: next,
        "cache-control": "no-store",
        "set-cookie": `${COOKIE}=${expected}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`,
      },
    });
  }

  if (readCookie(request, COOKIE) === expected) return undefined;
  return loginPage(url.pathname + url.search, false);
}

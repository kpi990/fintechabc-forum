import { initBotId } from "botid/client/core";

// Paths that carry automated-abuse risk: account creation, auth, voting,
// posting, commenting, and reporting. Read-only browsing (Home, Markets,
// News, board/post listings) is intentionally left unprotected so it stays
// fully crawlable by search engines and fast for real readers.
initBotId({
  protect: [
    { path: "/signup", method: "POST" },
    { path: "/login", method: "POST" },
    { path: "/board/*/new", method: "POST" },
    { path: "/coin/*/new", method: "POST" },
    { path: "/post/*", method: "POST" },
    { path: "/api/vote", method: "POST" },
  ],
});

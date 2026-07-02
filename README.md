# bird 🐦 — fast X CLI

Fast X/Twitter CLI for tweeting, replying, reading threads, searching, mentions — powered by X's
undocumented GraphQL API and your existing browser session (cookie auth).

Originally by **@steipete** (v0.8.0). Rescued and maintained by **@matar**.

## Disclaimer

This uses X/Twitter's **undocumented** web GraphQL API with cookie auth. X changes endpoints,
query IDs, and anti-bot behavior without notice — **expect breakage**.

## Install

### From source

```bash
git clone https://github.com/matar/bird
cd bird
pnpm install
pnpm build:dist   # TypeScript → JS
# or full binary
pnpm build        # includes Bun-compiled binary
```

### Usage (JS)

```bash
node dist/cli.js whoami
# or alias
pnpm bird whoami
```

### Binary (if bun is available)

```bash
pnpm binary
./bird whoami
```

### npm global

```bash
npm install -g @matar/bird
bird whoami
```

## Quickstart

```bash
# Show the logged-in account
bird whoami

# Read a tweet (URL or ID)
bird read https://x.com/user/status/1234567890123456789
bird 1234567890123456789 --json

# Thread + replies
bird thread https://x.com/user/status/1234567890123456789
bird replies 1234567890123456789

# Search + mentions
bird search "from:someone" -n 5
bird mentions -n 5

# User tweets
bird user-tweets @someone -n 20
bird user-tweets @someone --json

# Bookmarks
bird bookmarks -n 5

# Post
bird tweet "hello from bird"
bird reply 1234567890 "nice take"

# News & trending
bird news --ai-only -n 10
```

## Cookie auth

bird reads cookies from your browser (Safari, Chrome, Brave, Firefox, or Edge).
First run will prompt which browser to use:

```bash
bird whoami
```

Or provide a cookies.txt file via `BIRD_COOKIES_PATH` env var.

## Commands

| Command | Description |
|---------|-------------|
| `whoami` | Show logged-in account |
| `read` | Read a tweet by URL/ID |
| `thread` | Thread + replies |
| `replies` | Replies to a tweet |
| `search` | Search tweets |
| `mentions` | Recent mentions |
| `tweet` | Post a tweet |
| `reply` | Reply to a tweet |
| `user-tweets` | User's timeline |
| `bookmarks` | List bookmarks |
| `unbookmark` | Remove bookmark |
| `likes` | Recent likes |
| `following` | Who you follow |
| `followers` | Who follows you |
| `lists` | List timeline |
| `news` | AI-curated news/trending |
| `home` | Home timeline |
| `query-ids` | Refresh GraphQL query IDs |

## License

MIT — originally by Peter Steinberger (steipete), rescued by matar.

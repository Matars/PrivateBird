# PrivateBird 🐦 — fast X CLI

Fast X/Twitter CLI for tweeting, replying, reading threads, searching, mentions — powered by X's
undocumented GraphQL API and your existing browser session (cookie auth).

Originally by **@steipete** (bird v0.8.0). Rescued and maintained by **@matar**.

## Disclaimer

This uses X/Twitter's undocumented web GraphQL API with cookie auth. X changes endpoints,
query IDs, and anti-bot behavior without notice — expect breakage.

## Install

### From source

```bash
git clone https://github.com/Matars/PrivateBird
cd PrivateBird
pnpm install
pnpm build:dist   # TypeScript → JS
```

### Quick usage

```bash
node dist/cli.js whoami
pnpm bird whoami   # shorthand
```

## Quickstart

```bash
# Show the logged-in account
node dist/cli.js whoami

# Read a tweet
node dist/cli.js read https://x.com/user/status/1234567890123456789

# Post
node dist/cli.js tweet "hello from PrivateBird"

# Search
node dist/cli.js search "from:someone" -n 5

# Mentions
node dist/cli.js mentions -n 5

# Bookmarks
node dist/cli.js bookmarks -n 5

# Timeline
node dist/cli.js home -n 20
```

## License

MIT — originally by Peter Steinberger (steipete), maintained by matar.

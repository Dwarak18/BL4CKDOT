# BL4CKDOT Express Backend

This folder provides a dedicated Node.js + Express backend scaffold that complements the Next.js frontend.

## Features

- REST health endpoint
- WebSocket entry point for advanced terminal mode (`/ws/terminal`)
- JWT gate before terminal upgrade
- Placeholder sandbox echo stream (replace with `node-pty` + Docker sandbox)

## Run

```bash
node backend/server.js
```

Set env vars:

- `JWT_SECRET`
- `EXPRESS_PORT` (default: `4000`)

## Security hardening checklist

1. Attach `node-pty` only behind container sandbox isolation.
2. Restrict command allowlist and filesystem mounts.
3. Add rate limiting and audit logs per user session.
4. Enforce role checks (`admin`, approved collaborators only).

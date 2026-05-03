# Brewery Agent Rules

- Read `.codex/START_HERE.md` before making changes.
- Keep Brewery watch-only until a human explicitly approves PR execution.
- Do not add auto-merge, auto-deploy, or external auto-reply behavior in the MVP.
- Prefer deterministic rules over model output for routing, severity, and permissions.
- Treat Slack-only signals as low or medium confidence until confirmed by an official source.
- Every new source must have a checked-in registry entry under `sources/`.
- Every classifier rule change must include a `node --test` case.
- Keep evidence links, source hashes, timestamps, and affected repos in every durable signal.

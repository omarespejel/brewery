# Brewery Boss Brief

## Summary

Brewery is an internal maintenance control plane for Pathfinder, Scarb, and
Mezcal. It watches upstream Starknet changes, turns real signals into Linear
work, coordinates humans and agents in Slack, and proves changes through GitHub
PRs, CI, and canaries.

## Why Now

If we stop paying external teams to maintain Pathfinder and Scarb for us, we
need an internal system that notices upstream changes early and makes the work
durable. Chat messages are not enough. Random agent runs are not enough.

We need a control loop.

## How It Works

1. Source registries define what to watch.
2. Collectors pull releases, specs, docs, and allowlisted Slack signals.
3. Rules classify confidence and severity.
4. Linear tracks ownership and required checks.
5. Slack gets daily digests and urgent alerts.
6. Later, agents can draft PRs, but humans approve merge and deploy.

## Safety Model

Brewery starts watch-only.

It does not auto-merge, auto-deploy, or auto-reply externally. Slack-only
signals are treated as early warnings until confirmed by official sources.

## MVP Success Criteria

- Daily digest runs reliably.
- Actionable upstream changes become Linear issues.
- Each issue has evidence, affected repos, confidence, severity, and required
  checks.
- The team can trace why Brewery created every issue.
- No automatic production changes happen.

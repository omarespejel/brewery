# Brewery Operating Model

Brewery is the internal maintenance brain for Starknet infrastructure we own or
fork: Pathfinder, Scarb, and Mezcal.

The job is not to let AI decide everything. The job is to keep upstream change
signals, Linear issues, Slack coordination, GitHub PRs, and CI proof in one
explicit control loop.

## Source Hierarchy

Signals are ranked by source before any model sees them.

| Source | Default confidence | Notes |
| --- | --- | --- |
| Tagged release | confirmed | Official release notes or GitHub release. |
| Merged spec change | confirmed | OpenRPC/spec changes are high signal. |
| Official docs compatibility table | confirmed | Use for version support decisions. |
| StarkWare or maintainer announcement with date/link | high | Create issue and watch for confirming artifact. |
| Trusted Slack heads-up without link | medium | Useful early warning, not enough for risky action. |
| Random Slack discussion | low | Digest only unless repeated or confirmed. |

## Confidence Ladder

```text
low: random Slack discussion
medium: trusted engineer says change is coming
high: announcement with dates or linked PR
confirmed: merged spec, release note, compatibility table, tagged release
```

## Severity Rules

```text
RPC spec changed -> high
Cairo major/minor release -> medium/high for Scarb
Pathfinder patch release -> medium
Slack-only message -> watch until confirmed
Security advisory -> urgent
```

## Linear Issue Contract

Brewery-created issues should include:

```text
Source: Cairo release / RPC spec / Slack heads-up
Affects: Scarb fork, Pathfinder fork, Mezcal
Confidence: low / medium / high / confirmed
Severity: info / watch / actionable / urgent
Evidence: links and raw signal hash
Required checks: exact CI and canary list
Agent permission: none / draft PR allowed / human approval required
```

Linear is durable memory. Slack is coordination. GitHub is proof.

## Slack Contract

Slack gets:

- Daily digest.
- Urgent alerts.
- Draft internal summaries.
- Human approval prompts.

Slack must not be the source of truth. Slack-only information creates watch
signals unless it is backed by a durable artifact.

## Phase 1: Watch Only

- Run daily from GitHub Actions cron.
- Collect official releases, spec diffs, docs diffs, and allowlisted Slack
  signals.
- Classify deterministically.
- Summarize with AI only after deterministic classification.
- Create or update Linear issues for actionable and urgent signals.
- Post one daily Slack brief.

## Phase 2: Assisted PRs

```text
Linear issue labeled brewery:auto-start
  -> agent creates branch
  -> updates fork
  -> runs required checks
  -> opens PR
  -> posts evidence back to Linear
  -> human reviews
```

Agents may draft PRs. Humans approve merge and deploy.

## Phase 3: Internalized Maintenance

After Brewery survives multiple real upstream release cycles, expand it to:

- recurring compatibility canaries
- automated bisect reports
- release-readiness dashboards
- stricter branch-protection integration
- scoped agent PR execution

Do not skip the proof phase.

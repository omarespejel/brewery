import assert from "node:assert/strict";
import test from "node:test";

import { classifySignal, formatLinearIssue, shouldCreateLinearIssue } from "./rules.js";

test("RPC spec changes become high-severity Linear issues", () => {
  const signal = {
    id: "sig_rpc_1",
    sourceId: "starknet_rpc_specs",
    sourceKind: "github_file_diff",
    type: "rpc_spec_changed",
    title: "starknet_api_openrpc.json changed",
    affects: ["pathfinder", "mezcal"],
  };

  const classification = classifySignal(signal);

  assert.equal(classification.confidence, "confirmed");
  assert.equal(classification.severity, "high");
  assert.equal(classification.action, "linear_issue");
  assert.equal(shouldCreateLinearIssue(classification), true);
});

test("Slack-only trusted heads-up stays watch-level until confirmed", () => {
  const signal = {
    id: "sig_slack_1",
    sourceId: "starkware_slack_allowlist",
    sourceKind: "slack_message",
    trustedSource: true,
    title: "RPC behavior may change next month",
  };

  const classification = classifySignal(signal);

  assert.equal(classification.confidence, "medium");
  assert.equal(classification.severity, "watch");
  assert.equal(classification.action, "watch_issue");
  assert.equal(classification.agentPermission, "none");
});

test("Security advisories escalate to urgent Slack and Linear alerts", () => {
  const signal = {
    id: "sig_sec_1",
    sourceId: "pathfinder_releases",
    sourceKind: "github_release",
    security: true,
    title: "Pathfinder security advisory",
  };

  const classification = classifySignal(signal);

  assert.equal(classification.confidence, "confirmed");
  assert.equal(classification.severity, "urgent");
  assert.equal(classification.action, "linear_and_slack_alert");
  assert.equal(classification.agentPermission, "human_approval_required");
});

test("Linear issue payload keeps evidence and affected repos", () => {
  const signal = {
    title: "Cairo v2.x release",
    sourceId: "cairo_releases",
    sourceKind: "github_release",
    type: "cairo release",
    evidenceUrl: "https://github.com/starkware-libs/cairo/releases",
    affects: ["scarb", "pathfinder"],
    requiredChecks: ["cargo test --workspace"],
  };

  const classification = classifySignal(signal);
  const issue = formatLinearIssue(signal, classification);

  assert.deepEqual(issue.affects, ["scarb", "pathfinder"]);
  assert.deepEqual(issue.evidence, ["https://github.com/starkware-libs/cairo/releases"]);
  assert.deepEqual(issue.requiredChecks, ["cargo test --workspace"]);
});

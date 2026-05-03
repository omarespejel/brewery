const OFFICIAL_CONFIRMING_KINDS = new Set([
  "github_release",
  "github_releases",
  "github_file_diff",
  "docs_page_diff",
  "docs_page",
]);

const SLACK_KINDS = new Set(["slack", "slack_message", "slack_channels"]);

function textOf(signal) {
  return [signal.type, signal.sourceId, signal.sourceKind, signal.title, signal.body]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function hasAny(haystack, needles) {
  return needles.some((needle) => haystack.includes(needle));
}

function confidenceFor(signal, fallback = "low") {
  if (signal.confidence) return signal.confidence;
  if (signal.confirmed === true) return "confirmed";
  if (OFFICIAL_CONFIRMING_KINDS.has(signal.sourceKind)) return "confirmed";
  if (signal.hasLinkedOfficialArtifact === true) return "high";
  if (signal.trustedSource === true) return "medium";
  return fallback;
}

function baseResult(signal) {
  return {
    signalId: signal.id ?? null,
    confidence: confidenceFor(signal),
    severity: "info",
    action: "digest",
    agentPermission: "none",
    reasons: [],
  };
}

export function classifySignal(signal = {}) {
  const text = textOf(signal);
  const result = baseResult(signal);

  if (signal.security === true || hasAny(text, ["security advisory", "cve", "critical vulnerability"])) {
    result.confidence = confidenceFor(signal, "high");
    result.severity = "urgent";
    result.action = "linear_and_slack_alert";
    result.agentPermission = "human_approval_required";
    result.reasons.push("security signal requires immediate durable tracking");
    return result;
  }

  if (hasAny(text, ["openrpc", "rpc spec", "starknet_api_openrpc", "rpc_spec_changed"])) {
    result.confidence = confidenceFor(signal, "high");
    result.severity = "high";
    result.action = "linear_issue";
    result.agentPermission = "draft_pr_allowed_after_label";
    result.reasons.push("RPC spec changes affect Pathfinder and Mezcal compatibility");
    return result;
  }

  if (hasAny(text, ["cairo release", "cairo v", "compiler release"])) {
    result.confidence = confidenceFor(signal, "medium");
    result.severity = signal.majorOrMinor === true ? "high" : "medium";
    result.action = "linear_issue";
    result.agentPermission = "none";
    result.reasons.push("Cairo releases can affect Scarb, Pathfinder, and contract tooling");
    return result;
  }

  if (hasAny(text, ["scarb release", "scarb v"])) {
    result.confidence = confidenceFor(signal, "medium");
    result.severity = "medium";
    result.action = "linear_issue";
    result.agentPermission = "none";
    result.reasons.push("Scarb release should be checked against owned fork and Mezcal workflows");
    return result;
  }

  if (hasAny(text, ["pathfinder release", "pathfinder v"])) {
    result.confidence = confidenceFor(signal, "medium");
    result.severity = "medium";
    result.action = "linear_issue";
    result.agentPermission = "none";
    result.reasons.push("Pathfinder release should be checked against owned fork and canaries");
    return result;
  }

  if (SLACK_KINDS.has(signal.sourceKind)) {
    result.confidence = confidenceFor(signal, "low");
    result.severity = signal.trustedSource === true ? "watch" : "info";
    result.action = signal.trustedSource === true ? "watch_issue" : "digest";
    result.agentPermission = "none";
    result.reasons.push("Slack is an early-warning source until confirmed by an official artifact");
    return result;
  }

  result.reasons.push("no escalation rule matched");
  return result;
}

export function shouldCreateLinearIssue(classification) {
  return ["linear_issue", "linear_and_slack_alert", "watch_issue"].includes(classification.action);
}

export function formatLinearIssue(signal, classification) {
  return {
    title: signal.title,
    source: signal.sourceId,
    affects: signal.affects ?? [],
    confidence: classification.confidence,
    severity: classification.severity,
    evidence: signal.evidenceUrl ? [signal.evidenceUrl] : [],
    requiredChecks: signal.requiredChecks ?? [],
    agentPermission: classification.agentPermission,
    reasons: classification.reasons,
  };
}

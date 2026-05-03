import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { classifySignal, formatLinearIssue, shouldCreateLinearIssue } from "../src/classifier/rules.js";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..");
const samplePath = join(repoRoot, "fixtures", "signals.sample.json");

const signals = JSON.parse(await readFile(samplePath, "utf8"));

const classified = signals.map((signal) => {
  const classification = classifySignal(signal);
  return {
    signal,
    classification,
    linearIssue: shouldCreateLinearIssue(classification)
      ? formatLinearIssue(signal, classification)
      : null,
  };
});

console.log(JSON.stringify(classified, null, 2));

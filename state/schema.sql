CREATE TABLE IF NOT EXISTS signals (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL,
  source_kind TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  evidence_url TEXT,
  raw_hash TEXT NOT NULL,
  observed_at TEXT NOT NULL,
  affected_repos TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS classifications (
  signal_id TEXT PRIMARY KEY REFERENCES signals(id),
  confidence TEXT NOT NULL,
  severity TEXT NOT NULL,
  action TEXT NOT NULL,
  agent_permission TEXT NOT NULL,
  reasons_json TEXT NOT NULL,
  classified_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sink_writes (
  id TEXT PRIMARY KEY,
  signal_id TEXT NOT NULL REFERENCES signals(id),
  sink TEXT NOT NULL,
  external_id TEXT,
  external_url TEXT,
  status TEXT NOT NULL,
  error TEXT,
  written_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

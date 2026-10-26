-- migrations/0001_miorita_schema.sql
-- Cloudflare D1 Database schema for Miorița cross-device synchronization

CREATE TABLE IF NOT EXISTS sync_deltas (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  domain TEXT NOT NULL,
  version INTEGER NOT NULL,
  payload_json TEXT NOT NULL,
  client_updated_at INTEGER NOT NULL,
  server_updated_at INTEGER NOT NULL,
  UNIQUE(user_id, domain)
);

CREATE INDEX IF NOT EXISTS idx_sync_deltas_user_domain ON sync_deltas(user_id, domain);

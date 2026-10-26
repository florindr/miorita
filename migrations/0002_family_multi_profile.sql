-- migrations/0002_family_multi_profile.sql
-- Unified Family and Multi-Child Profile Schema for Miorița & Clawey

-- 1. Families Table (Governed by Parent via Google Auth / Passcode)
CREATE TABLE IF NOT EXISTS families (
    id TEXT PRIMARY KEY,
    google_sub TEXT UNIQUE,
    parent_email TEXT NOT NULL,
    parent_name TEXT NOT NULL,
    parent_pin_hash TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_families_google ON families(google_sub);
CREATE INDEX IF NOT EXISTS idx_families_email ON families(parent_email);

-- 2. Child Profiles Table (Multi-child support per family)
CREATE TABLE IF NOT EXISTS child_profiles (
    id TEXT PRIMARY KEY,
    family_id TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    age INTEGER NOT NULL DEFAULT 8,
    avatar TEXT NOT NULL DEFAULT 'lamb',
    dominant_language TEXT DEFAULT 'en-GB',
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_child_profiles_family ON child_profiles(family_id);

-- 3. Device Sessions / Tablet 1-Tap Launch Tokens
CREATE TABLE IF NOT EXISTS device_sessions (
    id TEXT PRIMARY KEY,
    family_id TEXT NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    active_profile_id TEXT NOT NULL REFERENCES child_profiles(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    device_name TEXT,
    created_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_device_token ON device_sessions(token_hash);

-- 4. Multi-Tenant Sync Deltas (Keyed by family_id, profile_id, app, domain)
CREATE TABLE IF NOT EXISTS profile_sync_deltas (
    id TEXT PRIMARY KEY,
    family_id TEXT NOT NULL,
    profile_id TEXT NOT NULL,
    app TEXT NOT NULL, -- 'miorita' or 'clawey'
    domain TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    payload_json TEXT NOT NULL,
    client_updated_at INTEGER NOT NULL,
    server_updated_at INTEGER NOT NULL,
    UNIQUE(family_id, profile_id, app, domain)
);
CREATE INDEX IF NOT EXISTS idx_profile_sync ON profile_sync_deltas(family_id, profile_id, app, domain);

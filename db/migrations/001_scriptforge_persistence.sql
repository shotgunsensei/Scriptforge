CREATE TABLE IF NOT EXISTS script_submissions (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  category TEXT NOT NULL,
  source_type TEXT NOT NULL,
  review_status TEXT NOT NULL,
  metadata_json JSONB NOT NULL,
  script_body TEXT NOT NULL,
  safety_scan_json JSONB NOT NULL,
  submitter_json JSONB NOT NULL,
  reviewer_identity TEXT,
  reviewer_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  script_storage_path TEXT,
  metadata_storage_path TEXT,
  readme_storage_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (source_type, category, slug)
);

CREATE TABLE IF NOT EXISTS script_versions (
  id TEXT PRIMARY KEY,
  submission_id TEXT REFERENCES script_submissions(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  source_type TEXT NOT NULL,
  version TEXT NOT NULL,
  metadata_json JSONB NOT NULL,
  script_body TEXT NOT NULL,
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS script_reviews (
  id TEXT PRIMARY KEY,
  submission_id TEXT REFERENCES script_submissions(id) ON DELETE CASCADE,
  reviewer_identity TEXT NOT NULL,
  review_status TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS script_audit_events (
  id TEXT PRIMARY KEY,
  submission_id TEXT REFERENCES script_submissions(id) ON DELETE SET NULL,
  slug TEXT NOT NULL,
  source_type TEXT NOT NULL,
  review_status TEXT NOT NULL,
  event_type TEXT NOT NULL,
  actor TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS script_admin_users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_script_submissions_status ON script_submissions(review_status);
CREATE INDEX IF NOT EXISTS idx_script_submissions_source_category ON script_submissions(source_type, category);
CREATE INDEX IF NOT EXISTS idx_script_audit_events_slug ON script_audit_events(slug);
CREATE INDEX IF NOT EXISTS idx_script_admin_users_role ON script_admin_users(role);

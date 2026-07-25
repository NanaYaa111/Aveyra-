-- Aveyra Supabase schema (starter)
-- WARNING: Review and adapt to your project's PostgreSQL extensions and conventions.
-- This file defines the core tables referenced by the frontend code (relationships,
-- answers, memories, journal_entries). Fields that hold encrypted content are
-- plain text here because encryption is performed by the client before writing.

-- Enable extensions if needed (uncomment and adjust for your DB)
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at bigint NOT NULL,
  updated_at bigint NOT NULL,
  deleted_at bigint,
  schema_version integer NOT NULL,
  partner_name text,
  owner_user_id uuid -- reference to profile user who owns/created relationship (project-dependent)
);

CREATE TABLE IF NOT EXISTS public.answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at bigint NOT NULL,
  updated_at bigint NOT NULL,
  deleted_at bigint,
  schema_version integer NOT NULL,
  relationship_id uuid NOT NULL,
  question_id text NOT NULL,
  author text NOT NULL, -- e.g. 'partner_one' | 'partner_two' or user id
  content text NOT NULL,
  version integer NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS public.memories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at bigint NOT NULL,
  updated_at bigint NOT NULL,
  deleted_at bigint,
  schema_version integer NOT NULL,
  relationship_id uuid NOT NULL,
  title text,
  description text,
  memory_date bigint NOT NULL,
  image_ref text,
  version integer NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS public.journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at bigint NOT NULL,
  updated_at bigint NOT NULL,
  deleted_at bigint,
  schema_version integer NOT NULL,
  relationship_id uuid NOT NULL,
  title text,
  content text,
  version integer NOT NULL DEFAULT 1
);

-- Indexes to support typical access patterns
CREATE INDEX IF NOT EXISTS idx_answers_relationship ON public.answers (relationship_id);
CREATE INDEX IF NOT EXISTS idx_memories_relationship ON public.memories (relationship_id);
CREATE INDEX IF NOT EXISTS idx_journal_relationship ON public.journal_entries (relationship_id);

-- NOTE: Adjust types and default functions to match your Postgres installation
-- (e.g. use uuid_generate_v4() instead of gen_random_uuid()).

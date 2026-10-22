/*
# Redesign schema for editorial-luxury Kintsugi platform

This migration adapts the existing schema to the new 5-category editorial system,
adds book fragments, newsletter subscribers, sovereignty metrics, and extends
the buzon (contact) form with email + anonymous support.

1. Modified Tables
- `diary_posts`:
  - New column `tiktok_script` (text, nullable): the TikTok vertical video script.
  - Category CHECK constraint replaced: old values (fragmentacion, reconstruccion,
    soberania, creacion, conexion) → new values (digital, cuerpo, madre, mujer, mente).
  - Old seed rows with deprecated categories are removed so the new constraint applies.
- `buzon_messages`:
  - New column `email` (text, nullable): reader email when not anonymous.
  - New column `is_anonymous` (boolean, default false): sends message without name/email.

2. New Tables
- `book_fragments`: sporadic/weekly fragments of the book "De Fragmentada a Soberana".
  - id, title, body, chapter_label, created_at.
- `newsletter_subscribers`: emails joining "Notas de Voz Soberanas".
  - id, email (unique), created_at.
- `sovereignty_stats`: key/value metrics for the dashboard (body streak, digital status, etc.).
  - id, metric_key (unique), metric_value (text), updated_at.

3. Security
- RLS enabled on every new table.
- Public read/write for anon + authenticated (intentionally shared, no auth screen).

4. Notes
- No columns or tables are dropped. The deprecated category rows are deleted so the
  new CHECK constraint is satisfied; this only affects seed data from the prior migration.
- The old `image_url` column remains available for Instagram daily photos.
*/

-- --- diary_posts: swap category constraint ---
DELETE FROM diary_posts WHERE category NOT IN ('digital','cuerpo','madre','mujer','mente');

ALTER TABLE diary_posts DROP CONSTRAINT IF EXISTS diary_posts_category_check;

ALTER TABLE diary_posts ADD CONSTRAINT diary_posts_category_check
  CHECK (category IN ('digital','cuerpo','madre','mujer','mente'));

ALTER TABLE diary_posts ADD COLUMN IF NOT EXISTS tiktok_script text;

-- --- buzon_messages: add email + anonymous ---
ALTER TABLE buzon_messages ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE buzon_messages ADD COLUMN IF NOT EXISTS is_anonymous boolean NOT NULL DEFAULT false;

-- --- book_fragments ---
CREATE TABLE IF NOT EXISTS book_fragments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  chapter_label text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE book_fragments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_book" ON book_fragments;
CREATE POLICY "anon_select_book" ON book_fragments FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_book" ON book_fragments FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_book" ON book_fragments FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_book" ON book_fragments FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_book_fragments_created_at ON book_fragments (created_at DESC);

-- --- newsletter_subscribers ---
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_newsletter" ON newsletter_subscribers;
CREATE POLICY "anon_select_newsletter" ON newsletter_subscribers FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_newsletter" ON newsletter_subscribers FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_newsletter" ON newsletter_subscribers FOR DELETE
  TO anon, authenticated USING (true);

-- --- sovereignty_stats ---
CREATE TABLE IF NOT EXISTS sovereignty_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_key text UNIQUE NOT NULL,
  metric_value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE sovereignty_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_stats" ON sovereignty_stats;
CREATE POLICY "anon_select_stats" ON sovereignty_stats FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_stats" ON sovereignty_stats FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_stats" ON sovereignty_stats FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_stats" ON sovereignty_stats FOR DELETE
  TO anon, authenticated USING (true);

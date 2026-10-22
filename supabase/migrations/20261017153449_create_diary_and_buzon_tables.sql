/*
# Create diary_posts and buzon_messages tables (single-tenant, no auth)

1. New Tables
- `diary_posts`: daily reflections organized by the 5 program categories.
  - id (uuid, pk)
  - category (text): one of 'fragmentacion','reconstruccion','soberania','creacion','conexion'
  - title (text)
  - body (text)
  - image_url (text, nullable): Instagram daily photo URL
  - created_at (timestamptz, default now())
- `buzon_messages`: private testimonials/questions from readers.
  - id (uuid, pk)
  - name (text)
  - message (text)
  - created_at (timestamptz, default now())

2. Security
- RLS enabled on both tables.
- Public read/write for anon + authenticated (intentionally shared, no auth screen).
*/

CREATE TABLE IF NOT EXISTS diary_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('fragmentacion','reconstruccion','soberania','creacion','conexion')),
  title text NOT NULL,
  body text NOT NULL,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE diary_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_diary" ON diary_posts;
CREATE POLICY "anon_select_diary" ON diary_posts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_diary" ON diary_posts;
CREATE POLICY "anon_insert_diary" ON diary_posts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_diary" ON diary_posts;
CREATE POLICY "anon_update_diary" ON diary_posts FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_diary" ON diary_posts;
CREATE POLICY "anon_delete_diary" ON diary_posts FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_diary_posts_created_at ON diary_posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_diary_posts_category ON diary_posts (category);

CREATE TABLE IF NOT EXISTS buzon_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE buzon_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_buzon" ON buzon_messages;
CREATE POLICY "anon_select_buzon" ON buzon_messages FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_buzon" ON buzon_messages;
CREATE POLICY "anon_insert_buzon" ON buzon_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_buzon" ON buzon_messages;
CREATE POLICY "anon_delete_buzon" ON buzon_messages FOR DELETE
  TO anon, authenticated USING (true);

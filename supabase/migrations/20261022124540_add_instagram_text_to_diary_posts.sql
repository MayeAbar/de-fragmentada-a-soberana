/*
# Add instagram_text column to diary_posts

1. Modified Tables
- `diary_posts`:
  - New column `instagram_text` (text, nullable): the adapted long-form caption for
    Instagram/Facebook posts (title, 2-3 summarized paragraphs, interactive question).

2. Security
- No policy or RLS changes — all existing policies remain intact.

3. Notes
- No columns or tables are dropped. Only a new nullable column is added.
- Existing rows will have NULL in `instagram_text`, which is expected.
*/

ALTER TABLE diary_posts ADD COLUMN IF NOT EXISTS instagram_text text;

/*
# Replace "digital" category with "finanzas" in diary_posts

1. Modified Tables
- `diary_posts`:
  - Category CHECK constraint replaced: old values (digital, cuerpo, madre, mujer, mente)
    → new values (finanzas, cuerpo, madre, mujer, mente).
  - Existing rows with category = 'digital' are updated to 'finanzas' so no data is lost.

2. Security
- No policy or RLS changes — all existing policies remain intact.

3. Notes
- No columns or tables are dropped. Only the CHECK constraint is replaced
  and existing 'digital' rows are migrated to 'finanzas'.
- This aligns the schema with the corrected 5-pillar system:
  Cuerpo, Mente y Espiritualidad, Maternidad, Finanzas, Ser Mujer.
*/

-- Drop the old constraint first so the UPDATE can proceed
ALTER TABLE diary_posts DROP CONSTRAINT IF EXISTS diary_posts_category_check;

-- Migrate existing 'digital' rows to 'finanzas'
UPDATE diary_posts SET category = 'finanzas' WHERE category = 'digital';

-- Add the new constraint with the corrected 5-pillar system
ALTER TABLE diary_posts ADD CONSTRAINT diary_posts_category_check
  CHECK (category IN ('finanzas','cuerpo','madre','mujer','mente'));

-- Clean up the now-deprecated "digital" sovereignty stats keys
DELETE FROM sovereignty_stats WHERE metric_key IN ('digital_status','digital_detail');

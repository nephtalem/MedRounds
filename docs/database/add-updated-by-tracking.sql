-- ==========================================
-- Add "Last Updated By" Tracking to Rounds
-- ==========================================
-- This tracks who last modified the ward

-- Add columns to store who last updated the round
ALTER TABLE rounds 
ADD COLUMN IF NOT EXISTS last_updated_by_email TEXT,
ADD COLUMN IF NOT EXISTS last_updated_by_name TEXT;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_rounds_last_updated_by 
ON rounds(last_updated_by_email);

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Last Updated By tracking added!';
    RAISE NOTICE '📝 Columns: last_updated_by_email, last_updated_by_name';
END $$;


-- ==========================================
-- PERFORMANCE OPTIMIZATION SQL SCRIPT
-- Run this in Supabase SQL Editor
-- Estimated time: 5 minutes
-- ==========================================

-- ==========================================
-- STEP 1: Add Required Columns First
-- ==========================================

-- Add timestamps to rounds table (if not exists)
ALTER TABLE rounds ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE rounds ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add timestamps to patients table (if not exists)
ALTER TABLE patients ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE patients ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add user_id to patients for faster queries (denormalization)
ALTER TABLE patients ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Backfill user_id for existing patients
UPDATE patients
SET user_id = rounds.user_id
FROM rounds
WHERE patients.round_id = rounds.id
AND patients.user_id IS NULL;

-- ==========================================
-- STEP 2: Add Indexes for Query Performance
-- ==========================================

-- Rounds table indexes
CREATE INDEX IF NOT EXISTS idx_rounds_user_id ON rounds(user_id);
CREATE INDEX IF NOT EXISTS idx_rounds_status ON rounds(status);
CREATE INDEX IF NOT EXISTS idx_rounds_date ON rounds(date DESC);
CREATE INDEX IF NOT EXISTS idx_rounds_user_status ON rounds(user_id, status);

-- Patients table indexes
CREATE INDEX IF NOT EXISTS idx_patients_round_id ON patients(round_id);
CREATE INDEX IF NOT EXISTS idx_patients_user_id ON patients(user_id);
CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(name);
CREATE INDEX IF NOT EXISTS idx_patients_round_user ON patients(round_id, user_id);

-- ==========================================
-- STEP 3: Auto-Update Timestamp Function
-- ==========================================

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ==========================================
-- STEP 4: Create Triggers
-- ==========================================

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_rounds_updated_at ON rounds;
DROP TRIGGER IF EXISTS update_patients_updated_at ON patients;

-- Create triggers for auto-updating updated_at
CREATE TRIGGER update_rounds_updated_at 
    BEFORE UPDATE ON rounds
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at 
    BEFORE UPDATE ON patients
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- STEP 5: Verify Installation
-- ==========================================

-- Check indexes
SELECT 
    tablename, 
    indexname 
FROM pg_indexes 
WHERE schemaname = 'public' 
    AND tablename IN ('rounds', 'patients')
ORDER BY tablename, indexname;

-- Check columns
SELECT 
    table_name, 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name IN ('rounds', 'patients')
    AND column_name IN ('created_at', 'updated_at')
ORDER BY table_name, column_name;

-- ==========================================
-- SUCCESS MESSAGE
-- ==========================================

DO $$
BEGIN
    RAISE NOTICE '✅ Performance optimization complete!';
    RAISE NOTICE '📊 Indexes added for faster queries';
    RAISE NOTICE '⏰ Timestamps added for tracking';
    RAISE NOTICE '🔄 Auto-update triggers created';
END $$;


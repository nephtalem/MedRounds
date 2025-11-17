-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create rounds table
CREATE TABLE rounds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  round_number TEXT,
  status TEXT CHECK (status IN ('active', 'completed', 'archived')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patients table
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  round_id UUID NOT NULL REFERENCES rounds(id) ON DELETE CASCADE,
  
  -- Patient fields (from your Excel)
  name TEXT NOT NULL,
  brief_history TEXT,
  diagnosis TEXT,
  physical_examination TEXT,
  imaging TEXT,
  lab_result TEXT,
  incident TEXT,
  medications TEXT,
  plan TEXT,
  round TEXT,
  
  -- Metadata
  serial_no INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_rounds_user_id ON rounds(user_id);
CREATE INDEX idx_rounds_date ON rounds(date);
CREATE INDEX idx_patients_round_id ON patients(round_id);

-- Enable Row Level Security (RLS)
ALTER TABLE rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Rounds policies: Users can only see their own rounds
CREATE POLICY "Users can view own rounds"
  ON rounds FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own rounds"
  ON rounds FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rounds"
  ON rounds FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own rounds"
  ON rounds FOR DELETE
  USING (auth.uid() = user_id);

-- Patients policies: Users can only see patients in their own rounds
CREATE POLICY "Users can view patients in own rounds"
  ON patients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM rounds
      WHERE rounds.id = patients.round_id
      AND rounds.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create patients in own rounds"
  ON patients FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM rounds
      WHERE rounds.id = patients.round_id
      AND rounds.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update patients in own rounds"
  ON patients FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM rounds
      WHERE rounds.id = patients.round_id
      AND rounds.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete patients in own rounds"
  ON patients FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM rounds
      WHERE rounds.id = patients.round_id
      AND rounds.user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_rounds_updated_at BEFORE UPDATE ON rounds
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


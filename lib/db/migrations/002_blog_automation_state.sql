-- Migration 002: Blog Automation State
-- Creates a simple key-value store for automation state persistence

CREATE TABLE IF NOT EXISTS automation_state (
  key VARCHAR(255) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_automation_state_updated ON automation_state(updated_at DESC);

-- Insert initial blog automation state
INSERT INTO automation_state (key, value)
VALUES ('blog-post', '{"lastPostedIndex": -1, "lastPostedDate": ""}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_automation_state_updated_at ON automation_state;
CREATE TRIGGER update_automation_state_updated_at
  BEFORE UPDATE ON automation_state
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment for documentation
COMMENT ON TABLE automation_state IS 'Stores state for various automation tasks (blog posting, social media, etc.)';
COMMENT ON COLUMN automation_state.key IS 'Unique identifier for the automation task';
COMMENT ON COLUMN automation_state.value IS 'State data in JSONB format';

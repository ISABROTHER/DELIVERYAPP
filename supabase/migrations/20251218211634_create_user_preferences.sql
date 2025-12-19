/*
  # User Preferences System

  ## Overview
  Stores user preferences for profile settings including:
  - Favorite pickup point (agent selection)
  - Notification preferences (SMS and Email)
  - Individual shipment notification toggles

  ## Tables Created

  1. `user_preferences`
     - Stores all user preferences
     - Links to auth.users
     - Default values for all settings
     - JSON fields for flexible notification settings

  ## Security
  - RLS enabled
  - Users can only read/write their own preferences
*/

CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Favorite pickup point
  favorite_agent_id uuid REFERENCES agents(id) ON DELETE SET NULL,
  
  -- Notification preferences
  notifications_enabled boolean DEFAULT true,
  sms_enabled boolean DEFAULT true,
  email_enabled boolean DEFAULT true,
  
  -- Individual notification toggles
  notify_customs boolean DEFAULT true,
  notify_business boolean DEFAULT false,
  notify_parcel_on_way boolean DEFAULT true,
  notify_ready_for_pickup boolean DEFAULT true,
  notify_delivered boolean DEFAULT true,
  notify_delays boolean DEFAULT true,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_favorite_agent ON user_preferences(favorite_agent_id) WHERE favorite_agent_id IS NOT NULL;

-- Enable RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own preferences
CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can insert their own preferences
CREATE POLICY "Users can create own preferences"
  ON user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update their own preferences
CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_user_preferences_updated_at();

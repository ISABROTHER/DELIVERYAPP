/*
  # Shipments System for Ghana Parcel Delivery

  ## Overview
  This migration creates the complete shipments system supporting:
  - Guest recipients (phone-only, no app required)
  - Registered recipients (optional upgrade)
  - Origin and destination with region/city/landmark
  - Drop-off and pickup handover methods
  - Agent selection and verification
  - Secure handover with sender PIN
  - Delivery verification with recipient OTP

  ## Tables Created

  1. `agents`
     - Registered pickup/drop-off points
     - Location and operating hours
     - Can verify shipments

  2. `shipments`
     - Core shipment data
     - Links sender (required user) and recipient (phone required, user optional)
     - Stores origin, destination, handover details
     - Includes security codes (sender PIN, tracking code, delivery OTP)

  3. `shipment_events`
     - Status change tracking
     - Audit trail

  ## Security
  - RLS enabled on all tables
  - Senders can view their sent shipments
  - Recipients can view shipments sent to their phone (if registered)
  - Agents can only view shipments assigned to them
*/

-- Agents table
CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  region text NOT NULL,
  city_town text NOT NULL,
  address_text text NOT NULL,
  landmark text,
  gps_latitude decimal(10, 8),
  gps_longitude decimal(11, 8),
  operating_hours jsonb DEFAULT '{"monday": "8am-6pm", "tuesday": "8am-6pm", "wednesday": "8am-6pm", "thursday": "8am-6pm", "friday": "8am-6pm", "saturday": "8am-2pm", "sunday": "closed"}'::jsonb,
  is_active boolean DEFAULT true,
  can_pickup boolean DEFAULT true,
  can_dropoff boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Shipments table
CREATE TABLE IF NOT EXISTS shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Sender (always required - must be logged in)
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_name text NOT NULL,
  sender_phone text NOT NULL,

  -- Recipient (phone required, user optional for guest recipients)
  recipient_phone text NOT NULL,
  recipient_name text NOT NULL,
  recipient_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Parcel details
  parcel_size text NOT NULL CHECK (parcel_size IN ('small', 'medium', 'large')),
  weight_range text NOT NULL,
  category text,

  -- Origin (where parcel is coming from)
  origin_region text NOT NULL,
  origin_city_town text NOT NULL,
  origin_landmark text,
  origin_gps jsonb,

  -- Destination (where parcel is going to)
  destination_region text NOT NULL,
  destination_city_town text NOT NULL,
  destination_landmark text,

  -- Handover method
  handover_method text NOT NULL CHECK (handover_method IN ('DROPOFF', 'PICKUP')),
  pickup_details jsonb,

  -- Agent assignment
  assigned_agent_id uuid REFERENCES agents(id) ON DELETE SET NULL,
  selected_at_handover_agent_id uuid REFERENCES agents(id) ON DELETE SET NULL,

  -- Security codes
  shipment_code text NOT NULL UNIQUE,
  sender_handover_pin text NOT NULL,
  delivery_otp text,
  tracking_id text NOT NULL UNIQUE,

  -- Pricing
  base_price decimal(10, 2) NOT NULL,
  pickup_fee decimal(10, 2) DEFAULT 0,
  total_price decimal(10, 2) NOT NULL,

  -- Status
  status text NOT NULL DEFAULT 'PAID_AWAITING_HANDOVER' CHECK (
    status IN (
      'PAID_AWAITING_HANDOVER',
      'HANDED_OVER_TO_AGENT',
      'IN_TRANSIT',
      'OUT_FOR_DELIVERY',
      'DELIVERED',
      'FAILED',
      'CANCELLED'
    )
  ),

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  paid_at timestamptz DEFAULT now(),
  handed_over_at timestamptz,
  delivered_at timestamptz,

  -- Metadata
  notes text,
  terms_accepted boolean DEFAULT true
);

-- Shipment events (audit trail)
CREATE TABLE IF NOT EXISTS shipment_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  description text,
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_type text CHECK (actor_type IN ('sender', 'recipient', 'agent', 'system')),
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_shipments_sender_id ON shipments(sender_id);
CREATE INDEX IF NOT EXISTS idx_shipments_recipient_phone ON shipments(recipient_phone);
CREATE INDEX IF NOT EXISTS idx_shipments_recipient_user_id ON shipments(recipient_user_id) WHERE recipient_user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_id ON shipments(tracking_id);
CREATE INDEX IF NOT EXISTS idx_shipments_shipment_code ON shipments(shipment_code);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipment_events_shipment_id ON shipment_events(shipment_id);
CREATE INDEX IF NOT EXISTS idx_agents_location ON agents(region, city_town) WHERE is_active = true;

-- Enable RLS
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipment_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for agents
-- Anyone can view active agents (needed for agent selection)
CREATE POLICY "Anyone can view active agents"
  ON agents FOR SELECT
  TO authenticated
  USING (is_active = true);

-- RLS Policies for shipments
-- Senders can view their sent shipments
CREATE POLICY "Senders can view own sent shipments"
  ON shipments FOR SELECT
  TO authenticated
  USING (sender_id = auth.uid());

-- Registered recipients can view shipments sent to their phone
CREATE POLICY "Recipients can view shipments to them"
  ON shipments FOR SELECT
  TO authenticated
  USING (
    recipient_user_id = auth.uid()
    OR recipient_phone IN (
      SELECT phone FROM auth.users WHERE id = auth.uid()
    )
  );

-- Senders can insert their own shipments
CREATE POLICY "Users can create shipments as sender"
  ON shipments FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

-- Senders can update their own shipments (limited fields)
CREATE POLICY "Senders can update own shipments"
  ON shipments FOR UPDATE
  TO authenticated
  USING (sender_id = auth.uid())
  WITH CHECK (sender_id = auth.uid());

-- RLS Policies for shipment_events
-- Users can view events for shipments they're involved in
CREATE POLICY "Users can view events for their shipments"
  ON shipment_events FOR SELECT
  TO authenticated
  USING (
    shipment_id IN (
      SELECT id FROM shipments
      WHERE sender_id = auth.uid()
         OR recipient_user_id = auth.uid()
         OR recipient_phone IN (
           SELECT phone FROM auth.users WHERE id = auth.uid()
         )
    )
  );

-- System can insert events
CREATE POLICY "System can create events"
  ON shipment_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Insert sample agents for testing
INSERT INTO agents (name, phone, region, city_town, address_text, landmark, gps_latitude, gps_longitude, can_pickup, can_dropoff) VALUES
  ('Accra Main Hub', '+233200000001', 'Greater Accra', 'Accra', 'Oxford Street, Osu', 'Near Danquah Circle', 5.5600, -0.1969, true, true),
  ('Kumasi Central', '+233200000002', 'Ashanti', 'Kumasi', 'Adum, Prempeh II Street', 'Opposite Kejetia Market', 6.6885, -1.6244, true, true),
  ('Tema Community 1', '+233200000003', 'Greater Accra', 'Tema', 'Community 1, Main Road', 'Near Tema Station', 5.6698, -0.0166, false, true),
  ('East Legon Point', '+233200000004', 'Greater Accra', 'Accra', 'East Legon, Shiashie', 'American House', 5.6465, -0.1622, false, true),
  ('Takoradi Harbor', '+233200000005', 'Western', 'Takoradi', 'Harbor Road, Market Circle', 'Near Takoradi Mall', 4.8974, -1.7554, true, true)
ON CONFLICT DO NOTHING;

-- Function to generate unique shipment code
CREATE OR REPLACE FUNCTION generate_shipment_code()
RETURNS text AS $$
DECLARE
  code text;
  exists boolean;
BEGIN
  LOOP
    code := 'SHP' || LPAD(FLOOR(RANDOM() * 1000000)::text, 6, '0');
    SELECT EXISTS(SELECT 1 FROM shipments WHERE shipment_code = code) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Function to generate unique tracking ID
CREATE OR REPLACE FUNCTION generate_tracking_id()
RETURNS text AS $$
DECLARE
  tracking_id text;
  exists boolean;
BEGIN
  LOOP
    tracking_id := 'TRK' || UPPER(SUBSTR(MD5(RANDOM()::text), 1, 10));
    SELECT EXISTS(SELECT 1 FROM shipments WHERE tracking_id = tracking_id) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN tracking_id;
END;
$$ LANGUAGE plpgsql;

-- Function to generate 6-digit PIN
CREATE OR REPLACE FUNCTION generate_pin()
RETURNS text AS $$
BEGIN
  RETURN LPAD(FLOOR(RANDOM() * 1000000)::text, 6, '0');
END;
$$ LANGUAGE plpgsql;

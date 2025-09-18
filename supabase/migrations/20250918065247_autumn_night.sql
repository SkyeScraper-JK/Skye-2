/*
  # Promotional Collaboration Schema

  This migration adds tables and functionality for promotional collaboration
  between Developers and Agents in the Property Agent application.

  ## New Tables:
  1. **agent_property_interests** - Tracks which properties agents are interested in promoting
  2. **promotions** - Developer-created promotional offers for properties
  3. **promotion_notifications** - Tracks notification delivery to interested agents
  4. **system_notifications** - General system notifications for all users

  ## Features:
  - Agents can opt-in/out of promoting specific properties
  - Developers can create targeted promotional offers
  - Notifications sent only to interested agents
  - Admin oversight of all promotional activities
*/

-- Agent Property Interest tracking
CREATE TABLE IF NOT EXISTS agent_property_interests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid REFERENCES users(id) ON DELETE CASCADE,
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  is_interested boolean DEFAULT true,
  opted_in_date timestamptz DEFAULT now(),
  opted_out_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(agent_id, property_id)
);

-- Promotional offers from developers
CREATE TABLE IF NOT EXISTS promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id uuid REFERENCES developers(id) ON DELETE CASCADE,
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  offer_details text NOT NULL,
  promotion_type text DEFAULT 'discount' CHECK (promotion_type IN ('discount', 'freebie', 'upgrade', 'cashback', 'other')),
  discount_percentage decimal(5,2),
  discount_amount decimal(15,2),
  terms_and_conditions text,
  valid_from date NOT NULL,
  valid_until date NOT NULL,
  is_active boolean DEFAULT true,
  max_bookings integer, -- Optional limit on number of bookings
  current_bookings integer DEFAULT 0,
  target_audience text DEFAULT 'all_agents' CHECK (target_audience IN ('all_agents', 'opted_in_agents', 'specific_agents')),
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Promotion notification tracking
CREATE TABLE IF NOT EXISTS promotion_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promotion_id uuid REFERENCES promotions(id) ON DELETE CASCADE,
  agent_id uuid REFERENCES users(id) ON DELETE CASCADE,
  notification_type text DEFAULT 'push' CHECK (notification_type IN ('push', 'email', 'sms', 'in_app')),
  sent_at timestamptz DEFAULT now(),
  delivery_status text DEFAULT 'sent' CHECK (delivery_status IN ('sent', 'delivered', 'read', 'failed')),
  read_at timestamptz,
  clicked_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- System notifications (general notifications for all users)
CREATE TABLE IF NOT EXISTS system_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_type text NOT NULL CHECK (notification_type IN ('new_property', 'promotion', 'system_update', 'maintenance', 'security', 'general')),
  title text NOT NULL,
  message text NOT NULL,
  data jsonb, -- Additional notification data
  target_role text CHECK (target_role IN ('agent', 'developer', 'buyer', 'admin', 'all')),
  target_users uuid[], -- Specific user IDs if targeted
  property_id uuid REFERENCES properties(id),
  project_id uuid REFERENCES projects(id),
  promotion_id uuid REFERENCES promotions(id),
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  is_active boolean DEFAULT true,
  scheduled_for timestamptz DEFAULT now(),
  expires_at timestamptz,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- User notification status (tracks read/unread status per user)
CREATE TABLE IF NOT EXISTS user_notification_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  notification_id uuid REFERENCES system_notifications(id) ON DELETE CASCADE,
  is_read boolean DEFAULT false,
  read_at timestamptz,
  is_dismissed boolean DEFAULT false,
  dismissed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, notification_id)
);

-- Promotion analytics (track performance)
CREATE TABLE IF NOT EXISTS promotion_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  promotion_id uuid REFERENCES promotions(id) ON DELETE CASCADE,
  metric_type text NOT NULL CHECK (metric_type IN ('view', 'click', 'booking', 'conversion')),
  agent_id uuid REFERENCES users(id),
  property_id uuid REFERENCES properties(id),
  value_numeric decimal(15,2), -- For amounts, percentages
  value_text text, -- For text-based metrics
  metadata jsonb, -- Additional tracking data
  recorded_at timestamptz DEFAULT now()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX IF NOT EXISTS idx_agent_property_interests_agent_id ON agent_property_interests(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_property_interests_property_id ON agent_property_interests(property_id);
CREATE INDEX IF NOT EXISTS idx_agent_property_interests_interested ON agent_property_interests(is_interested) WHERE is_interested = true;

CREATE INDEX IF NOT EXISTS idx_promotions_developer_id ON promotions(developer_id);
CREATE INDEX IF NOT EXISTS idx_promotions_property_id ON promotions(property_id);
CREATE INDEX IF NOT EXISTS idx_promotions_active ON promotions(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_promotions_valid_dates ON promotions(valid_from, valid_until);

CREATE INDEX IF NOT EXISTS idx_system_notifications_target_role ON system_notifications(target_role);
CREATE INDEX IF NOT EXISTS idx_system_notifications_type ON system_notifications(notification_type);
CREATE INDEX IF NOT EXISTS idx_system_notifications_active ON system_notifications(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_user_notification_status_user_id ON user_notification_status(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notification_status_unread ON user_notification_status(is_read) WHERE is_read = false;

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS
ALTER TABLE agent_property_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notification_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_analytics ENABLE ROW LEVEL SECURITY;

-- Agent Property Interest Policies
CREATE POLICY "Agents can manage their own interests" ON agent_property_interests
  FOR ALL TO authenticated
  USING (agent_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Developers can view interests in their properties" ON agent_property_interests
  FOR SELECT TO authenticated
  USING (
    property_id IN (
      SELECT p.id FROM properties p
      JOIN projects pr ON p.project_id = pr.id
      JOIN developers d ON pr.developer_id = d.id
      WHERE d.user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    )
  );

-- Promotion Policies
CREATE POLICY "Developers can manage their own promotions" ON promotions
  FOR ALL TO authenticated
  USING (developer_id IN (
    SELECT id FROM developers WHERE user_id = (
      SELECT id FROM users WHERE auth_user_id = auth.uid()
    )
  ));

CREATE POLICY "Agents can view active promotions" ON promotions
  FOR SELECT TO authenticated
  USING (
    is_active = true AND 
    valid_until >= CURRENT_DATE AND
    auth.uid() IN (SELECT auth_user_id FROM users WHERE role = 'agent')
  );

-- System Notification Policies
CREATE POLICY "Users can view notifications for their role" ON system_notifications
  FOR SELECT TO authenticated
  USING (
    target_role = 'all' OR
    target_role = (SELECT role FROM users WHERE auth_user_id = auth.uid()) OR
    (SELECT id FROM users WHERE auth_user_id = auth.uid()) = ANY(target_users)
  );

CREATE POLICY "Developers and admins can create notifications" ON system_notifications
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() IN (
      SELECT auth_user_id FROM users WHERE role IN ('developer', 'admin')
    )
  );

-- User Notification Status Policies
CREATE POLICY "Users can manage their own notification status" ON user_notification_status
  FOR ALL TO authenticated
  USING (user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()));

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to create notifications when new properties are added
CREATE OR REPLACE FUNCTION notify_agents_new_property()
RETURNS TRIGGER AS $$
BEGIN
  -- Create notification for all agents when a new property is added
  IF TG_OP = 'INSERT' AND NEW.visibility = 'public' THEN
    INSERT INTO system_notifications (
      notification_type,
      title,
      message,
      target_role,
      property_id,
      project_id,
      data,
      created_by
    ) VALUES (
      'new_property',
      'New Property Available',
      'A new property "' || (SELECT name FROM projects WHERE id = NEW.project_id) || '" is now available for promotion',
      'agent',
      NEW.id,
      NEW.project_id,
      jsonb_build_object(
        'property_id', NEW.id,
        'project_id', NEW.project_id,
        'developer_id', (SELECT developer_id FROM projects WHERE id = NEW.project_id)
      ),
      (SELECT user_id FROM developers WHERE id = (SELECT developer_id FROM projects WHERE id = NEW.project_id))
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to notify interested agents about new promotions
CREATE OR REPLACE FUNCTION notify_interested_agents_promotion()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.is_active = true THEN
    -- Insert notification records for agents interested in this property
    INSERT INTO promotion_notifications (promotion_id, agent_id, notification_type)
    SELECT 
      NEW.id,
      api.agent_id,
      'push'
    FROM agent_property_interests api
    WHERE api.property_id = NEW.property_id 
      AND api.is_interested = true;
      
    -- Also create system notification
    INSERT INTO system_notifications (
      notification_type,
      title,
      message,
      target_role,
      property_id,
      project_id,
      promotion_id,
      data,
      created_by
    ) VALUES (
      'promotion',
      NEW.title,
      NEW.message,
      'agent',
      NEW.property_id,
      NEW.project_id,
      NEW.id,
      jsonb_build_object(
        'promotion_id', NEW.id,
        'property_id', NEW.property_id,
        'offer_details', NEW.offer_details,
        'valid_until', NEW.valid_until
      ),
      NEW.created_by
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER notify_agents_new_property_trigger
  AFTER INSERT ON properties
  FOR EACH ROW
  EXECUTE FUNCTION notify_agents_new_property();

CREATE TRIGGER notify_interested_agents_promotion_trigger
  AFTER INSERT ON promotions
  FOR EACH ROW
  EXECUTE FUNCTION notify_interested_agents_promotion();

-- Function to update promotion analytics
CREATE OR REPLACE FUNCTION track_promotion_analytics()
RETURNS TRIGGER AS $$
BEGIN
  -- Track when agents view promotions
  IF TG_OP = 'UPDATE' AND OLD.is_read = false AND NEW.is_read = true THEN
    INSERT INTO promotion_analytics (
      promotion_id,
      metric_type,
      agent_id,
      property_id,
      recorded_at
    )
    SELECT 
      sn.promotion_id,
      'view',
      NEW.user_id,
      sn.property_id,
      now()
    FROM system_notifications sn
    WHERE sn.id = NEW.notification_id 
      AND sn.promotion_id IS NOT NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_promotion_analytics_trigger
  AFTER UPDATE ON user_notification_status
  FOR EACH ROW
  EXECUTE FUNCTION track_promotion_analytics();

-- Update triggers for updated_at
CREATE TRIGGER update_agent_property_interests_updated_at 
  BEFORE UPDATE ON agent_property_interests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_promotions_updated_at 
  BEFORE UPDATE ON promotions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
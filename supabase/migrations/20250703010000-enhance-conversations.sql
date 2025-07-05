-- Enhance conversations table with schema versioning and new fields
ALTER TABLE conversations 
ADD COLUMN schema_version smallint NOT NULL DEFAULT 1,
ADD COLUMN emotional_state jsonb,
ADD COLUMN intent_analysis jsonb,
ADD COLUMN voice_metadata jsonb,
ADD COLUMN service_context jsonb;

-- Add indexes for performance
CREATE INDEX idx_conversations_schema_version ON conversations(schema_version);
CREATE INDEX idx_conversations_emotional_state ON conversations USING gin(emotional_state);
CREATE INDEX idx_conversations_intent_analysis USING gin(intent_analysis);

-- Create type for visual analysis status
CREATE TYPE visual_analysis_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- Create visual insights table
CREATE TABLE visual_insights (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id uuid REFERENCES conversations(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    analysis_type text NOT NULL,
    status visual_analysis_status DEFAULT 'pending',
    input_data jsonb,
    analysis_result jsonb,
    metadata jsonb
);

-- Create emotional analytics table
CREATE TABLE emotional_analytics (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id uuid REFERENCES conversations(id),
    timestamp timestamptz DEFAULT now(),
    emotion_type text NOT NULL,
    confidence float NOT NULL,
    context jsonb,
    metadata jsonb
);

-- Add indexes for analytics
CREATE INDEX idx_visual_insights_conversation ON visual_insights(conversation_id);
CREATE INDEX idx_visual_insights_status ON visual_insights(status);
CREATE INDEX idx_emotional_analytics_conversation ON emotional_analytics(conversation_id);
CREATE INDEX idx_emotional_analytics_emotion ON emotional_analytics(emotion_type);

-- Add trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_visual_insights_updated_at
    BEFORE UPDATE ON visual_insights
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 
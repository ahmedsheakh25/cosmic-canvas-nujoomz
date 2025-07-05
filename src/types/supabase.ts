import { Database as SupabaseDatabase } from '@supabase/supabase-js';

export interface Database extends SupabaseDatabase {
  public: {
    Tables: {
      conversations: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          user_id: string;
          schema_version: number;
          emotional_state: Json;
          intent_analysis: Json;
          voice_metadata: Json;
          service_context: Json;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          schema_version?: number;
          emotional_state?: Json;
          intent_analysis?: Json;
          voice_metadata?: Json;
          service_context?: Json;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          schema_version?: number;
          emotional_state?: Json;
          intent_analysis?: Json;
          voice_metadata?: Json;
          service_context?: Json;
        };
      };
      visual_insights: {
        Row: {
          id: string;
          conversation_id: string;
          created_at: string;
          updated_at: string;
          analysis_type: string;
          status: 'pending' | 'processing' | 'completed' | 'failed';
          input_data: Json;
          analysis_result: Json;
          metadata: Json;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          created_at?: string;
          updated_at?: string;
          analysis_type: string;
          status?: 'pending' | 'processing' | 'completed' | 'failed';
          input_data?: Json;
          analysis_result?: Json;
          metadata?: Json;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          created_at?: string;
          updated_at?: string;
          analysis_type?: string;
          status?: 'pending' | 'processing' | 'completed' | 'failed';
          input_data?: Json;
          analysis_result?: Json;
          metadata?: Json;
        };
      };
      emotional_analytics: {
        Row: {
          id: string;
          conversation_id: string;
          timestamp: string;
          emotion_type: string;
          confidence: number;
          context: Json;
          metadata: Json;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          timestamp?: string;
          emotion_type: string;
          confidence: number;
          context?: Json;
          metadata?: Json;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          timestamp?: string;
          emotion_type?: string;
          confidence?: number;
          context?: Json;
          metadata?: Json;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      visual_analysis_status: 'pending' | 'processing' | 'completed' | 'failed';
    };
  };
}

type Json = Record<string, unknown>; 
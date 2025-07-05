export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          brief_id: string
          details: Json | null
          id: string
          performed_by: string | null
          timestamp: string | null
        }
        Insert: {
          action: string
          brief_id: string
          details?: Json | null
          id?: string
          performed_by?: string | null
          timestamp?: string | null
        }
        Update: {
          action?: string
          brief_id?: string
          details?: Json | null
          id?: string
          performed_by?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_brief_id_fkey"
            columns: ["brief_id"]
            isOneToOne: false
            referencedRelation: "project_briefs"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_activity_log: {
        Row: {
          action_type: string
          created_at: string
          created_by: string | null
          description: string
          id: string
          project_brief_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          project_brief_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          project_brief_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_activity_log_project_brief_id_fkey"
            columns: ["project_brief_id"]
            isOneToOne: false
            referencedRelation: "project_briefs"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_tour_completion: {
        Row: {
          completed_at: string
          id: string
          tour_type: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          tour_type?: string
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          tour_type?: string
          user_id?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          action: string
          created_at: string
          feature: string
          id: string
          metadata: Json | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          feature: string
          id?: string
          metadata?: Json | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          feature?: string
          id?: string
          metadata?: Json | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      assistant_prompt_history: {
        Row: {
          assistant_id: string | null
          id: string
          prompt_id: string | null
          used_at: string
          user_id: string | null
        }
        Insert: {
          assistant_id?: string | null
          id?: string
          prompt_id?: string | null
          used_at?: string
          user_id?: string | null
        }
        Update: {
          assistant_id?: string | null
          id?: string
          prompt_id?: string | null
          used_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assistant_prompt_history_assistant_id_fkey"
            columns: ["assistant_id"]
            isOneToOne: false
            referencedRelation: "assistants"
            referencedColumns: ["id"]
          },
        ]
      }
      assistants: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          frequency_penalty: number | null
          id: string
          is_active: boolean | null
          max_tokens: number | null
          metadata: Json | null
          model: string
          name: string
          presence_penalty: number | null
          system_prompt: string
          temperature: number | null
          tools: Json | null
          top_p: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          frequency_penalty?: number | null
          id: string
          is_active?: boolean | null
          max_tokens?: number | null
          metadata?: Json | null
          model?: string
          name: string
          presence_penalty?: number | null
          system_prompt: string
          temperature?: number | null
          tools?: Json | null
          top_p?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          frequency_penalty?: number | null
          id?: string
          is_active?: boolean | null
          max_tokens?: number | null
          metadata?: Json | null
          model?: string
          name?: string
          presence_penalty?: number | null
          system_prompt?: string
          temperature?: number | null
          tools?: Json | null
          top_p?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      assistants_backup: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          frequency_penalty: number | null
          id: string | null
          is_active: boolean | null
          max_tokens: number | null
          metadata: Json | null
          model: string | null
          name: string | null
          presence_penalty: number | null
          system_prompt: string | null
          temperature: number | null
          tools: Json | null
          top_p: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          frequency_penalty?: number | null
          id?: string | null
          is_active?: boolean | null
          max_tokens?: number | null
          metadata?: Json | null
          model?: string | null
          name?: string | null
          presence_penalty?: number | null
          system_prompt?: string | null
          temperature?: number | null
          tools?: Json | null
          top_p?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          frequency_penalty?: number | null
          id?: string | null
          is_active?: boolean | null
          max_tokens?: number | null
          metadata?: Json | null
          model?: string | null
          name?: string | null
          presence_penalty?: number | null
          system_prompt?: string | null
          temperature?: number | null
          tools?: Json | null
          top_p?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      brief_notes: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          note: string
          project_brief_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          note: string
          project_brief_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string
          project_brief_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brief_notes_project_brief_id_fkey"
            columns: ["project_brief_id"]
            isOneToOne: false
            referencedRelation: "project_briefs"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          language: string | null
          message: string
          sender: string
          session_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          language?: string | null
          message: string
          sender: string
          session_id: string
        }
        Update: {
          created_at?: string
          id?: string
          language?: string | null
          message?: string
          sender?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_conversations_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "user_sessions"
            referencedColumns: ["session_id"]
          },
        ]
      }
      content: {
        Row: {
          content_data: Json
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          content_data: Json
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          content_data?: Json
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          chat_data: Json
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          chat_data: Json
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          chat_data?: Json
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_toggles: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          feature_name: string
          id: string
          is_enabled: boolean
          required_role: Database["public"]["Enums"]["app_role"] | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          feature_name: string
          id?: string
          is_enabled?: boolean
          required_role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          feature_name?: string
          id?: string
          is_enabled?: boolean
          required_role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      knowledge_base: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          is_published: boolean | null
          tags: string[] | null
          title: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_published?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_published?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      openai_sync_operations: {
        Row: {
          completed_at: string | null
          created_at: string
          error_count: number | null
          error_details: Json | null
          id: string
          items_processed: number | null
          items_synced: number | null
          operation_details: Json | null
          operation_type: string
          performed_by: string | null
          started_at: string
          status: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_count?: number | null
          error_details?: Json | null
          id?: string
          items_processed?: number | null
          items_synced?: number | null
          operation_details?: Json | null
          operation_type: string
          performed_by?: string | null
          started_at?: string
          status?: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_count?: number | null
          error_details?: Json | null
          id?: string
          items_processed?: number | null
          items_synced?: number | null
          operation_details?: Json | null
          operation_type?: string
          performed_by?: string | null
          started_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_briefs: {
        Row: {
          assigned_to: string | null
          brief_data: Json
          client_info: Json | null
          created_at: string | null
          id: string
          internal_notes: string | null
          language: string | null
          pdf_url: string | null
          session_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          brief_data: Json
          client_info?: Json | null
          created_at?: string | null
          id?: string
          internal_notes?: string | null
          language?: string | null
          pdf_url?: string | null
          session_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          brief_data?: Json
          client_info?: Json | null
          created_at?: string | null
          id?: string
          internal_notes?: string | null
          language?: string | null
          pdf_url?: string | null
          session_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_briefs_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_briefs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "user_sessions"
            referencedColumns: ["session_id"]
          },
          {
            foreignKeyName: "project_briefs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      project_reports: {
        Row: {
          email_sent: boolean | null
          email_sent_at: string | null
          generated_at: string
          id: string
          pdf_url: string | null
          project_brief_id: string | null
          report_type: string | null
          thumbnail_url: string | null
        }
        Insert: {
          email_sent?: boolean | null
          email_sent_at?: string | null
          generated_at?: string
          id?: string
          pdf_url?: string | null
          project_brief_id?: string | null
          report_type?: string | null
          thumbnail_url?: string | null
        }
        Update: {
          email_sent?: boolean | null
          email_sent_at?: string | null
          generated_at?: string
          id?: string
          pdf_url?: string | null
          project_brief_id?: string | null
          report_type?: string | null
          thumbnail_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_reports_project_brief_id_fkey"
            columns: ["project_brief_id"]
            isOneToOne: false
            referencedRelation: "project_briefs"
            referencedColumns: ["id"]
          },
        ]
      }
      project_templates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          service_type: string
          template_data: Json | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          service_type: string
          template_data?: Json | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          service_type?: string
          template_data?: Json | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      prompts: {
        Row: {
          category: string
          content: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_public: boolean | null
          is_template: boolean | null
          openai_assistant_id: string | null
          openai_prompt_type: string | null
          openai_source: string | null
          openai_synced_at: string | null
          rating: number | null
          tags: string[] | null
          title: string
          updated_at: string
          usage_count: number | null
          variables: Json | null
        }
        Insert: {
          category?: string
          content: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          is_template?: boolean | null
          openai_assistant_id?: string | null
          openai_prompt_type?: string | null
          openai_source?: string | null
          openai_synced_at?: string | null
          rating?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string
          usage_count?: number | null
          variables?: Json | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          is_template?: boolean | null
          openai_assistant_id?: string | null
          openai_prompt_type?: string | null
          openai_source?: string | null
          openai_synced_at?: string | null
          rating?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          usage_count?: number | null
          variables?: Json | null
        }
        Relationships: []
      }
      service_suggestions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          priority: string | null
          reasoning: string | null
          service: string
          session_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          reasoning?: string | null
          service: string
          session_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          reasoning?: string | null
          service?: string
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_suggestions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "user_sessions"
            referencedColumns: ["session_id"]
          },
        ]
      }
      suggested_services: {
        Row: {
          confidence_score: number | null
          created_at: string
          id: string
          project_brief_id: string | null
          service_type: string
          session_id: string | null
          status: string | null
          suggestion_reason: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          id?: string
          project_brief_id?: string | null
          service_type: string
          session_id?: string | null
          status?: string | null
          suggestion_reason?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          id?: string
          project_brief_id?: string | null
          service_type?: string
          session_id?: string | null
          status?: string | null
          suggestion_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suggested_services_project_brief_id_fkey"
            columns: ["project_brief_id"]
            isOneToOne: false
            referencedRelation: "project_briefs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suggested_services_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "user_sessions"
            referencedColumns: ["session_id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          created_at: string
          description: string | null
          estimated_hours: number | null
          id: string
          priority: number | null
          project_brief_id: string | null
          service_type: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          estimated_hours?: number | null
          id?: string
          priority?: number | null
          project_brief_id?: string | null
          service_type: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          estimated_hours?: number | null
          id?: string
          priority?: number | null
          project_brief_id?: string | null
          service_type?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_brief_id_fkey"
            columns: ["project_brief_id"]
            isOneToOne: false
            referencedRelation: "project_briefs"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          created_at: string | null
          id: string
          name: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_activity_history: {
        Row: {
          activity_data: Json | null
          activity_type: string
          created_at: string
          id: string
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          created_at?: string
          id?: string
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          created_at?: string
          id?: string
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_interactions: {
        Row: {
          created_at: string | null
          id: string
          interaction_data: Json
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          interaction_data: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          interaction_data?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_personas: {
        Row: {
          created_at: string
          default_greeting: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          ui_theme: Json | null
          updated_at: string
          voice_settings: Json | null
        }
        Insert: {
          created_at?: string
          default_greeting?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          ui_theme?: Json | null
          updated_at?: string
          voice_settings?: Json | null
        }
        Update: {
          created_at?: string
          default_greeting?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          ui_theme?: Json | null
          updated_at?: string
          voice_settings?: Json | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          id: string
          language_preference: string | null
          last_sentiment_update: string | null
          sentiment_score: number | null
          session_id: string
          thread_id: string | null
          updated_at: string
          user_sentiment: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          language_preference?: string | null
          last_sentiment_update?: string | null
          sentiment_score?: number | null
          session_id: string
          thread_id?: string | null
          updated_at?: string
          user_sentiment?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          language_preference?: string | null
          last_sentiment_update?: string | null
          sentiment_score?: number | null
          session_id?: string
          thread_id?: string | null
          updated_at?: string
          user_sentiment?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          id: string
          language_preference: string | null
          persona_id: string | null
          session_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          language_preference?: string | null
          persona_id?: string | null
          session_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          language_preference?: string | null
          persona_id?: string | null
          session_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "user_personas"
            referencedColumns: ["id"]
          },
        ]
      }
      voice_commands: {
        Row: {
          command_text: string
          command_type: string
          executed_at: string
          execution_result: Json | null
          id: string
          session_id: string | null
        }
        Insert: {
          command_text: string
          command_type: string
          executed_at?: string
          execution_result?: Json | null
          id?: string
          session_id?: string | null
        }
        Update: {
          command_text?: string
          command_type?: string
          executed_at?: string
          execution_result?: Json | null
          id?: string
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "voice_commands_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "user_sessions"
            referencedColumns: ["session_id"]
          },
        ]
      }
      voice_settings: {
        Row: {
          created_at: string
          id: string
          language: string | null
          service_type: string | null
          session_id: string | null
          updated_at: string
          voice_id: string | null
          voice_provider: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          language?: string | null
          service_type?: string | null
          session_id?: string | null
          updated_at?: string
          voice_id?: string | null
          voice_provider?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          language?: string | null
          service_type?: string | null
          session_id?: string | null
          updated_at?: string
          voice_id?: string | null
          voice_provider?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "voice_settings_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "user_sessions"
            referencedColumns: ["session_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const

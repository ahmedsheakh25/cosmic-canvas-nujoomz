/// <reference types="vite/client" />

interface ImportMetaEnv {
  // API Keys
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_OPENAI_ORG_ID: string
  readonly VITE_ELEVENLABS_API_KEY: string
  readonly VITE_ELEVENLABS_VOICE_ID: string
  
  // Database Configuration
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_SUPABASE_SERVICE_ROLE_KEY: string
  
  // Color Services
  readonly VITE_HUEMINT_API_KEY: string
  readonly VITE_COLORMIND_API_ENDPOINT: string
  
  // Analytics
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ANALYTICS_ENDPOINT: string
  readonly VITE_ANALYTICS_API_KEY: string
  
  // Survey Integration
  readonly VITE_SURVEYSPARROW_TOKEN: string
  readonly VITE_SURVEYSPARROW_FORM_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 
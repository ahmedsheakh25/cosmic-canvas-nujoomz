import OpenAI from 'openai';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_ORG_ID = import.meta.env.VITE_OPENAI_ORG_ID;

class OpenAIClient {
  private client: OpenAI | null = null;
  private static instance: OpenAIClient;

  private constructor() {
    this.initializeClient();
  }

  public static getInstance(): OpenAIClient {
    if (!OpenAIClient.instance) {
      OpenAIClient.instance = new OpenAIClient();
    }
    return OpenAIClient.instance;
  }

  private initializeClient() {
    try {
      if (!OPENAI_API_KEY) {
        console.warn('OpenAI API key not found in environment variables');
        return;
      }

      this.client = new OpenAI({
        apiKey: OPENAI_API_KEY,
        organization: OPENAI_ORG_ID,
      });
    } catch (error) {
      console.error('Error initializing OpenAI client:', error);
    }
  }

  public getClient(): OpenAI | null {
    return this.client;
  }

  public isConfigured(): boolean {
    return !!this.client;
  }
}

export const openaiClient = OpenAIClient.getInstance(); 
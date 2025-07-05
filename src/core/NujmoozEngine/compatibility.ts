import { NujmoozEngineConfig, SessionContext, UserInput, NujmoozResponse } from './types';

export class CompatibilityLayer {
  constructor(private config: NujmoozEngineConfig) {}

  async processLegacyInput(input: UserInput, context: SessionContext): Promise<NujmoozResponse> {
    // Convert legacy input format to new format
    const convertedInput = this.convertLegacyInput(input);
    
    // Process using legacy hooks
    const response = await this.processWithLegacyHooks(convertedInput, context);
    
    // Convert response to new format
    return this.convertToNewFormat(response, context);
  }

  private convertLegacyInput(input: UserInput): any {
    // Convert new input format to legacy format
    return {
      message: input.content,
      type: input.type,
      language: input.language || this.config.defaultLanguage,
      // Add any legacy-specific fields
    };
  }

  private async processWithLegacyHooks(legacyInput: any, context: SessionContext): Promise<any> {
    try {
      // Here we'll integrate with existing hooks
      // This is temporary until full migration is complete
      return {
        content: 'Legacy response',
        metadata: {
          // Legacy metadata
        }
      };
    } catch (error) {
      console.error('Error in legacy processing:', error);
      throw new Error('Failed to process with legacy hooks');
    }
  }

  private convertToNewFormat(legacyResponse: any, context: SessionContext): NujmoozResponse {
    return {
      messageId: legacyResponse.id || Date.now().toString(),
      content: legacyResponse.content,
      emotionalState: {
        primaryEmotion: {
          type: 'neutral',
          confidence: 1
        },
        secondaryEmotions: [],
        metadata: {}
      },
      serviceContext: {
        detectedServices: [],
        confidence: 0,
        metadata: {}
      },
      metadata: {
        isLegacy: true,
        originalResponse: legacyResponse,
        schemaVersion: 1
      }
    };
  }
} 
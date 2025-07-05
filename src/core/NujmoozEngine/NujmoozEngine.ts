import {
  EmotionEngine,
  IntentEngine,
  VoiceEngine,
  PromptEngine,
  SalesEngine
} from './index';

export class NujmoozEngine {
  emotion = new EmotionEngine();
  intent = new IntentEngine();
  voice = new VoiceEngine();
  prompt = new PromptEngine();
  sales = new SalesEngine();

  async processInput(input: string): Promise<string> {
    const intent = this.intent.detectIntent(input);
    const emotion = this.emotion.analyze(input);
    const prompt = this.prompt.buildPrompt({ input, intent, emotion });
    return prompt;
  }
} 
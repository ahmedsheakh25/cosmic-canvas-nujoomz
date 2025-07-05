import { REALTIME_CONFIG } from '@/hooks/realtime/config';

export class AudioRecorder {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private isInitialized = false;

  constructor(private onAudioData: (audioData: Float32Array) => void) {}

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Get optimal audio configuration
      const sampleRate = this.getOptimalSampleRate();
      
      // Request microphone access with optimal settings
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          ...REALTIME_CONFIG.AUDIO.CONSTRAINTS,
          sampleRate
        }
      });

      // Create audio context with optimal sample rate
      this.audioContext = new AudioContext({
        sampleRate,
        latencyHint: 'interactive'
      });

      // Load and initialize the audio worklet
      await this.audioContext.audioWorklet.addModule(REALTIME_CONFIG.AUDIO.AUDIO_WORKLET_PATH);
      
      this.workletNode = new AudioWorkletNode(this.audioContext, 'voice-chat-processor', {
        numberOfInputs: 1,
        numberOfOutputs: 1,
        channelCount: REALTIME_CONFIG.AUDIO.CHANNELS,
        processorOptions: {
          bufferSize: this.getOptimalBufferSize()
        }
      });

      // Handle audio data from worklet
      this.workletNode.port.onmessage = (event) => {
        if (event.data.type === 'audio_buffer') {
          this.onAudioData(event.data.buffer);
        }
      };

      // Set up audio routing
      this.source = this.audioContext.createMediaStreamSource(this.stream);
      this.source.connect(this.workletNode);
      this.workletNode.connect(this.audioContext.destination);

      this.isInitialized = true;
      console.log('Audio system initialized with sample rate:', sampleRate);
    } catch (error) {
      console.error('Error initializing audio system:', error);
      this.cleanup();
      throw new Error(this.getErrorMessage(error));
    }
  }

  async start() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      if (this.audioContext?.state === 'suspended') {
        await this.audioContext.resume();
      }

      console.log('Audio recording started');
    } catch (error) {
      console.error('Error starting audio recording:', error);
      this.cleanup();
      throw new Error(this.getErrorMessage(error));
    }
  }

  stop() {
    this.cleanup();
  }

  private cleanup() {
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }

    if (this.workletNode) {
      this.workletNode.disconnect();
      this.workletNode = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.isInitialized = false;
  }

  private getOptimalSampleRate(): number {
    try {
      const audioContext = new AudioContext();
      const systemSampleRate = audioContext.sampleRate;
      audioContext.close();

      // Find the closest supported sample rate
      if (systemSampleRate >= REALTIME_CONFIG.AUDIO.MIN_SAMPLE_RATE && 
          systemSampleRate <= REALTIME_CONFIG.AUDIO.MAX_SAMPLE_RATE) {
        return systemSampleRate;
      }

      return REALTIME_CONFIG.AUDIO.DEFAULT_SAMPLE_RATE;
    } catch {
      return REALTIME_CONFIG.AUDIO.DEFAULT_SAMPLE_RATE;
    }
  }

  private getOptimalBufferSize(): number {
    try {
      const audioContext = new AudioContext();
      // Use smaller buffer sizes for lower latency on powerful devices
      const preferredSize = Math.min(
        REALTIME_CONFIG.AUDIO.PREFERRED_BUFFER_SIZE,
        Math.floor(audioContext.sampleRate / 6)
      );
      audioContext.close();

      // Ensure buffer size is within bounds
      return Math.max(
        REALTIME_CONFIG.AUDIO.MIN_BUFFER_SIZE,
        Math.min(preferredSize, REALTIME_CONFIG.AUDIO.MAX_BUFFER_SIZE)
      );
    } catch {
      return REALTIME_CONFIG.AUDIO.PREFERRED_BUFFER_SIZE;
    }
  }

  private getErrorMessage(error: any): string {
    if (error instanceof Error) {
      if (error.name === 'NotAllowedError') {
        return 'Microphone access denied. Please allow microphone access and try again.';
      }
      if (error.name === 'NotFoundError') {
        return 'No microphone found. Please connect a microphone and try again.';
      }
      if (error.name === 'NotReadableError') {
        return 'Could not access microphone. Please check if another application is using it.';
      }
      return error.message;
    }
    return 'An unknown error occurred while accessing the microphone.';
  }
}

export class AudioQueue {
  private queue: Uint8Array[] = [];
  private isPlaying = false;
  private currentSource: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;

  constructor(private audioContext: AudioContext) {
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.audioContext.destination);
  }

  async addToQueue(audioData: Uint8Array) {
    console.log("Adding audio data to queue, size:", audioData.length);
    this.queue.push(audioData);
    
    if (!this.isPlaying) {
      await this.playNext();
    }
  }

  stop() {
    if (this.currentSource) {
      this.currentSource.stop();
      this.currentSource.disconnect();
      this.currentSource = null;
    }
    this.queue = [];
    this.isPlaying = false;
  }

  setVolume(volume: number) {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  private async playNext() {
    if (this.queue.length === 0) {
      this.isPlaying = false;
      console.log("Audio queue empty, stopping playback");
      return;
    }

    this.isPlaying = true;
    const audioData = this.queue.shift()!;

    try {
      const wavData = this.createWavFromPCM(audioData);
      const audioBuffer = await this.audioContext.decodeAudioData(wavData.buffer);
      
      this.currentSource = this.audioContext.createBufferSource();
      this.currentSource.buffer = audioBuffer;
      
      // Connect through gain node for volume control
      this.currentSource.connect(this.gainNode!);
      
      this.currentSource.onended = () => {
        this.currentSource?.disconnect();
        this.currentSource = null;
        this.playNext();
      };
      
      this.currentSource.start(0);
      console.log("Playing audio chunk");
    } catch (error) {
      console.error('Error playing audio:', error);
      this.playNext(); // Continue with next segment even if current fails
    }
  }

  private createWavFromPCM(pcmData: Uint8Array): Uint8Array {
    // Convert bytes to 16-bit samples (little endian)
    const int16Data = new Int16Array(pcmData.length / 2);
    for (let i = 0; i < pcmData.length; i += 2) {
      int16Data[i / 2] = (pcmData[i + 1] << 8) | pcmData[i];
    }
    
    // Create WAV header
    const wavHeader = new ArrayBuffer(44);
    const view = new DataView(wavHeader);
    
    const writeString = (view: DataView, offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    // WAV header parameters
    const sampleRate = this.audioContext.sampleRate;
    const numChannels = REALTIME_CONFIG.AUDIO.CHANNELS;
    const bitsPerSample = 16;
    const blockAlign = (numChannels * bitsPerSample) / 8;
    const byteRate = sampleRate * blockAlign;

    // Write WAV header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + int16Data.byteLength, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    writeString(view, 36, 'data');
    view.setUint32(40, int16Data.byteLength, true);

    // Combine header and data
    const wavArray = new Uint8Array(wavHeader.byteLength + int16Data.byteLength);
    wavArray.set(new Uint8Array(wavHeader), 0);
    wavArray.set(new Uint8Array(int16Data.buffer), wavHeader.byteLength);
    
    return wavArray;
  }
}

export const encodeAudioForAPI = (float32Array: Float32Array): string => {
  // Convert float32 to int16 (PCM16)
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  
  // Convert to base64
  const uint8Array = new Uint8Array(int16Array.buffer);
  let binary = '';
  const chunkSize = 0x8000; // 32KB chunks to avoid call stack issues
  
  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  
  return btoa(binary);
};

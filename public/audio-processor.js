class VoiceChatProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._bufferSize = 4096;
    this._buffer = new Float32Array(this._bufferSize);
    this._bufferIndex = 0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (!input || !input[0]) return true;

    const inputChannel = input[0];
    
    // Process incoming audio data
    for (let i = 0; i < inputChannel.length; i++) {
      this._buffer[this._bufferIndex] = inputChannel[i];
      this._bufferIndex++;

      // When buffer is full, send it to the main thread
      if (this._bufferIndex >= this._bufferSize) {
        this.port.postMessage({
          type: 'audio_buffer',
          buffer: this._buffer.slice()
        });
        this._bufferIndex = 0;
      }
    }

    // Always return true to keep the processor running
    return true;
  }
}

// Register the processor
registerProcessor('voice-chat-processor', VoiceChatProcessor); 
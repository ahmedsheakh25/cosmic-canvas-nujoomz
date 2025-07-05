
import { useState, useEffect, useCallback, useRef } from 'react';

interface TypewriterOptions {
  speed?: number; // characters per second
  enableSkip?: boolean;
  onComplete?: () => void;
  onStart?: () => void;
}

interface TypewriterState {
  displayText: string;
  isTyping: boolean;
  isThinking: boolean;
  isComplete: boolean;
  showCursor: boolean;
}

export const useTypewriterAnimation = (
  text: string,
  options: TypewriterOptions = {}
) => {
  const {
    speed = 65,
    enableSkip = true,
    onComplete,
    onStart
  } = options;

  const [state, setState] = useState<TypewriterState>({
    displayText: '',
    isTyping: false,
    isThinking: false,
    isComplete: false,
    showCursor: false
  });

  const animationRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentIndexRef = useRef(0);
  const isSkippedRef = useRef(false);

  // Calculate delay based on character type
  const getCharacterDelay = useCallback((char: string, nextChar?: string) => {
    const baseDelay = 1000 / speed;
    
    // Punctuation pauses
    if (/[.!?؟،。]/.test(char)) return 200;
    if (/[,;:]/.test(char)) return 150;
    
    // Spaces are faster
    if (char === ' ') return baseDelay * 0.5;
    
    // Line breaks need more time
    if (char === '\n') return 300;
    
    // Arabic text (slightly slower for better readability)
    if (/[\u0600-\u06FF]/.test(char)) return baseDelay * 1.1;
    
    return baseDelay;
  }, [speed]);

  // Start thinking animation
  const startThinking = useCallback(() => {
    setState(prev => ({
      ...prev,
      isThinking: true,
      isTyping: false,
      isComplete: false,
      displayText: '',
      showCursor: false
    }));
  }, []);

  // Start typing animation
  const startTyping = useCallback(() => {
    if (!text || isSkippedRef.current) return;

    setState(prev => ({
      ...prev,
      isThinking: false,
      isTyping: true,
      isComplete: false,
      showCursor: true,
      displayText: ''
    }));

    currentIndexRef.current = 0;
    onStart?.();

    const typeCharacter = () => {
      if (currentIndexRef.current >= text.length || isSkippedRef.current) {
        // Animation complete
        setState(prev => ({
          ...prev,
          isTyping: false,
          isComplete: true,
          showCursor: false,
          displayText: text
        }));
        onComplete?.();
        return;
      }

      const currentChar = text[currentIndexRef.current];
      const nextChar = text[currentIndexRef.current + 1];
      
      setState(prev => ({
        ...prev,
        displayText: text.slice(0, currentIndexRef.current + 1)
      }));

      currentIndexRef.current++;
      
      const delay = getCharacterDelay(currentChar, nextChar);
      timeoutRef.current = setTimeout(() => {
        animationRef.current = requestAnimationFrame(typeCharacter);
      }, delay);
    };

    // Start typing after a brief pause
    timeoutRef.current = setTimeout(() => {
      animationRef.current = requestAnimationFrame(typeCharacter);
    }, 100);
  }, [text, getCharacterDelay, onStart, onComplete]);

  // Skip animation
  const skipAnimation = useCallback(() => {
    if (!enableSkip || state.isComplete) return;

    isSkippedRef.current = true;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    setState({
      displayText: text,
      isTyping: false,
      isThinking: false,
      isComplete: true,
      showCursor: false
    });

    onComplete?.();
  }, [enableSkip, state.isComplete, text, onComplete]);

  // Reset animation
  const reset = useCallback(() => {
    isSkippedRef.current = false;
    currentIndexRef.current = 0;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    setState({
      displayText: '',
      isTyping: false,
      isThinking: false,
      isComplete: false,
      showCursor: false
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Reset when text changes
  useEffect(() => {
    if (text && text !== state.displayText) {
      reset();
    }
  }, [text, reset]);

  return {
    ...state,
    startThinking,
    startTyping,
    skipAnimation,
    reset
  };
};

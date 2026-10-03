// Native Browser Speech Synthesis & Recognition Utility for Rural Accessibility
// Helps non-literate or visually impaired citizens listen and speak to discover welfare schemes.

let currentUtterance: SpeechSynthesisUtterance | null = null;
let activeSpeakingId: string | null = null;
const listeners = new Set<(speakingId: string | null) => void>();

export const isSpeechSupported = (): boolean => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

export const isRecognitionSupported = (): boolean => {
  return typeof window !== 'undefined' && (
    'SpeechRecognition' in window || 
    'webkitSpeechRecognition' in window
  );
};

export const getActiveSpeakingId = (): string | null => activeSpeakingId;

export const subscribeSpeakingStatus = (callback: (speakingId: string | null) => void): (() => void) => {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
};

const notifyListeners = (id: string | null) => {
  activeSpeakingId = id;
  listeners.forEach(fn => fn(id));
};

export const stopSpeaking = (): void => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
    notifyListeners(null);
  }
};

export const speakText = (
  id: string,
  text: string, 
  lang: 'hi' | 'en' = 'hi',
  onEnd?: () => void
): boolean => {
  if (!isSpeechSupported()) return false;

  // If already speaking this item, toggle off
  if (activeSpeakingId === id) {
    stopSpeaking();
    return false;
  }

  stopSpeaking();

  try {
    const cleanText = text.replace(/[*_#`~[\]]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.92; // Gentle, clear pacing for rural clarity
    utterance.pitch = 1.0;

    // Pick best available voice
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const match = voices.find(v => 
        lang === 'hi' 
          ? (v.lang.toLowerCase().includes('hi') || v.name.toLowerCase().includes('hindi'))
          : (v.lang.toLowerCase().includes('en-in') || v.name.toLowerCase().includes('india'))
      );
      if (match) {
        utterance.voice = match;
      }
    }

    utterance.onstart = () => {
      notifyListeners(id);
    };

    utterance.onend = () => {
      currentUtterance = null;
      notifyListeners(null);
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      currentUtterance = null;
      notifyListeners(null);
      if (onEnd) onEnd();
    };

    currentUtterance = utterance;
    notifyListeners(id);
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('Speech synthesis error:', err);
    notifyListeners(null);
    return false;
  }
};

// Real Web Speech Recognition Helper
export const startListening = (
  lang: 'hi' | 'en',
  onResult: (text: string) => void,
  onError: (err: any) => void,
  onEnd: () => void
): { stop: () => void } | null => {
  if (!isRecognitionSupported()) return null;

  try {
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognitionClass();
    recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript) {
        onResult(transcript);
      }
    };

    recognition.onerror = (event: any) => {
      onError(event.error);
    };

    recognition.onend = () => {
      onEnd();
    };

    recognition.start();

    return {
      stop: () => {
        try {
          recognition.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  } catch (err) {
    onError(err);
    return null;
  }
};

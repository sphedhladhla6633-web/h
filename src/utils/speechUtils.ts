// Text-to-Speech (TTS) Voice Reader utility for mobile & field reading aloud

export class VoiceReader {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static currentUtterance: SpeechSynthesisUtterance | null = null;
  private static isSpeaking = false;
  private static listeners: Set<(speaking: boolean, text: string) => void> = new Set();
  private static currentText = '';

  static subscribe(listener: (speaking: boolean, text: string) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private static notify(speaking: boolean, text: string = '') {
    this.isSpeaking = speaking;
    this.currentText = text;
    this.listeners.forEach(l => l(speaking, text));
  }

  static getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  static getCurrentText(): string {
    return this.currentText;
  }

  static speak(text: string, onEnd?: () => void) {
    if (!this.synth) {
      alert('Your browser does not support voice text-to-speech.');
      return;
    }

    // If already speaking, cancel previous
    this.synth.cancel();

    // Clean text of markdown / symbols
    const cleanText = text
      .replace(/<[^>]*>/g, ' ')
      .replace(/[•*#_`~]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95; // slightly slower for high clarity in field
    utterance.pitch = 1.0;

    // Pick best available English voice
    const voices = this.synth.getVoices();
    const enVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Enhanced') || v.default)) || voices.find(v => v.lang.startsWith('en'));
    if (enVoice) {
      utterance.voice = enVoice;
    }

    utterance.onstart = () => {
      this.notify(true, cleanText);
    };

    utterance.onend = () => {
      this.notify(false, '');
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.notify(false, '');
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  static stop() {
    if (this.synth) {
      this.synth.cancel();
      this.notify(false, '');
    }
  }

  static toggle(text: string) {
    if (this.isSpeaking && this.currentText === text) {
      this.stop();
    } else {
      this.speak(text);
    }
  }
}

// Hybrid IELTS Listening Audio Engine (Web Speech API + Native Audio Stream Fallback)

let synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
let voices = [];
let audioUnlocked = false;

// Audio element fallback for 100% guarantee in all browsers
let currentAudio = null;

export const initSpeech = () => {
  if (typeof window === 'undefined') return;

  if (synth) {
    voices = synth.getVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = () => {
        voices = synth.getVoices();
      };
    }
  }

  // Unlock browser audio policy on first user interaction
  const unlockAudio = () => {
    if (audioUnlocked) return;
    audioUnlocked = true;
    if (synth && synth.paused) {
      synth.resume();
    }
    // Create silent audio to prime HTML5 Audio
    const silentAudio = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
    silentAudio.play().catch(() => {});

    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };

  window.addEventListener('click', unlockAudio);
  window.addEventListener('keydown', unlockAudio);
  window.addEventListener('touchstart', unlockAudio);
};

export const getVoices = () => {
  if (!synth) return [];
  if (voices.length === 0) voices = synth.getVoices();
  return voices;
};

// Play audio fallback via direct MP3 voice stream (UK / US accent)
export const playFallbackAudio = (word, accent = 'en-GB', rate = 1.0) => {
  if (typeof window === 'undefined') return;

  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  // Type 1 = UK Accent, Type 2 = US Accent
  const type = accent === 'en-GB' ? 1 : 2;
  const audioUrl = `https://dict.youdao.com/dictvoice?type=${type}&audio=${encodeURIComponent(word)}`;

  currentAudio = new Audio(audioUrl);
  currentAudio.playbackRate = rate;

  currentAudio.play().catch(err => {
    console.warn("Audio playback fallback error:", err);
  });
};

export const speakWord = (word, options = {}) => {
  if (typeof window === 'undefined') return;

  const { accent = 'en-GB', rate = 0.9, pitch = 1, forceFallback = false } = options;

  if (forceFallback || !synth) {
    playFallbackAudio(word, accent, rate);
    return;
  }

  try {
    // Chrome bug fix: resume if paused
    if (synth.paused) {
      synth.resume();
    }
    
    // Cancel any current utterance
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.lang = accent === 'en-GB' ? 'en-GB' : 'en-US';

    const availableVoices = getVoices();
    const matchedVoice = availableVoices.find(v => 
      accent === 'en-GB' 
        ? (v.lang === 'en-GB' || v.lang.startsWith('en-GB') || v.name.includes('UK') || v.name.includes('British') || v.name.includes('Kate') || v.name.includes('Oliver') || v.name.includes('Daniel') || v.name.includes('Serena')) 
        : (v.lang === 'en-US' || v.lang.startsWith('en-US') || v.name.includes('US') || v.name.includes('American') || v.name.includes('Samantha') || v.name.includes('Alex'))
    ) || availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0];

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    let spoken = false;
    utterance.onstart = () => {
      spoken = true;
    };

    utterance.onerror = (e) => {
      console.warn("SpeechSynthesis error, switching to fallback MP3:", e);
      playFallbackAudio(word, accent, rate);
    };

    synth.speak(utterance);

    // If SpeechSynthesis fails to start within 400ms, use MP3 fallback
    setTimeout(() => {
      if (!spoken && !synth.speaking) {
        playFallbackAudio(word, accent, rate);
      }
    }, 400);

  } catch (err) {
    console.warn("SpeechSynthesis exception, fallback MP3:", err);
    playFallbackAudio(word, accent, rate);
  }
};

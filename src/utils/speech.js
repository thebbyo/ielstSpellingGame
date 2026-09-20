// Bulletproof IELTS Listening Audio Engine (SpeechSynthesis + Multi-Source Native MP3 Audio)

let synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
let voices = [];
let audioUnlocked = false;
let currentAudio = null;

// Global audio mode state: 'auto' | 'webspeech' | 'mp3'
let audioMode = typeof window !== 'undefined' ? (localStorage.getItem('ielts_audio_mode') || 'auto') : 'auto';

export const getAudioMode = () => audioMode;
export const setAudioMode = (mode) => {
  audioMode = mode;
  if (typeof window !== 'undefined') {
    localStorage.setItem('ielts_audio_mode', mode);
  }
};

export const initSpeech = () => {
  if (typeof window === 'undefined') return;

  if (synth) {
    try {
      voices = synth.getVoices();
      if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = () => {
          voices = synth.getVoices();
        };
      }
    } catch (e) {
      console.warn("SpeechSynthesis getVoices error:", e);
    }
  }

  // Unlock browser audio policy on first user interaction
  const unlockAudio = () => {
    if (audioUnlocked) return;
    audioUnlocked = true;
    
    if (synth) {
      try {
        if (synth.paused) synth.resume();
      } catch (e) {}
    }

    // Play tiny silent audio buffer to unlock HTML5 Audio element on iOS/Safari/Chrome
    try {
      const silentAudio = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
      silentAudio.play().catch(() => {});
    } catch (e) {}

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
  if (voices.length === 0) {
    try { voices = synth.getVoices(); } catch (e) {}
  }
  return voices;
};

// Multi-Source MP3 Audio Player with fallback providers
export const playFallbackAudio = (word, accent = 'en-GB', rate = 1.0) => {
  if (typeof window === 'undefined') return;

  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (e) {}
    currentAudio = null;
  }

  const cleanWord = encodeURIComponent(word.trim().toLowerCase());
  const isUK = accent === 'en-GB';

  // Array of reliable TTS audio URL providers
  const audioProviders = [
    // Provider 1: Youdao Dictionary Voice (Type 1 = UK, Type 2 = US)
    `https://dict.youdao.com/dictvoice?type=${isUK ? 1 : 2}&audio=${cleanWord}`,
    // Provider 2: Google Translate TTS (en-GB or en-US)
    `https://translate.google.com/translate_tts?ie=UTF-8&tl=${isUK ? 'en-GB' : 'en-US'}&client=tw-ob&q=${cleanWord}`,
    // Provider 3: Dictionary API MP3 Pronunciation
    `https://api.dictionaryapi.dev/media/pronunciations/en/${cleanWord}-${isUK ? 'uk' : 'us'}.mp3`
  ];

  let providerIndex = 0;

  const tryNextProvider = () => {
    if (providerIndex >= audioProviders.length) {
      console.warn("All audio fallback providers exhausted for word:", word);
      return;
    }

    const currentUrl = audioProviders[providerIndex];
    providerIndex++;

    try {
      const audio = new Audio(currentUrl);
      audio.playbackRate = rate;
      currentAudio = audio;

      audio.play().catch(err => {
        console.warn(`Audio provider ${providerIndex} failed, trying next:`, err);
        tryNextProvider();
      });

      audio.onerror = () => {
        tryNextProvider();
      };
    } catch (err) {
      tryNextProvider();
    }
  };

  tryNextProvider();
};

export const speakWord = (word, options = {}) => {
  if (typeof window === 'undefined' || !word) return;

  const { accent = 'en-GB', rate = 0.9, pitch = 1 } = options;

  // Force MP3 stream mode if set by user
  if (audioMode === 'mp3' || !synth) {
    playFallbackAudio(word, accent, rate);
    return;
  }

  try {
    // WebKit / Chrome fix: Ensure speech engine is active & unpaused
    if (synth.paused) {
      synth.resume();
    }

    // Safely stop previous utterances
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

    let spokenStarted = false;

    utterance.onstart = () => {
      spokenStarted = true;
    };

    utterance.onerror = (e) => {
      console.warn("SpeechSynthesis error event fired, using MP3 audio fallback:", e);
      playFallbackAudio(word, accent, rate);
    };

    synth.speak(utterance);

    // Watchdog timer: If SpeechSynthesis doesn't start speaking within 350ms, trigger MP3 fallback!
    setTimeout(() => {
      if (!spokenStarted && (!synth.speaking || synth.paused)) {
        console.warn("SpeechSynthesis timeout, switching to MP3 audio fallback...");
        playFallbackAudio(word, accent, rate);
      }
    }, 350);

  } catch (err) {
    console.warn("SpeechSynthesis exception, playing fallback MP3:", err);
    playFallbackAudio(word, accent, rate);
  }
};

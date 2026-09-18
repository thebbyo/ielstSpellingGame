// Speech synthesis helper for IELTS Listening Audio

let synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
let voices = [];

export const initSpeech = () => {
  if (!synth) return;
  voices = synth.getVoices();
  if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = () => {
      voices = synth.getVoices();
    };
  }
};

export const getVoices = () => {
  if (!synth) return [];
  if (voices.length === 0) voices = synth.getVoices();
  return voices;
};

export const speakWord = (word, options = {}) => {
  if (!synth) return;

  const { accent = 'en-GB', rate = 0.9, pitch = 1 } = options;

  // Cancel any ongoing speech
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(word);
  utterance.rate = rate;
  utterance.pitch = pitch;

  // Try to find matching accent (UK preferred for IELTS)
  const availableVoices = getVoices();
  const matchedVoice = availableVoices.find(v => 
    accent === 'en-GB' 
      ? (v.lang === 'en-GB' || v.name.includes('UK') || v.name.includes('British') || v.name.includes('Oliver') || v.name.includes('Kate')) 
      : (v.lang === 'en-US' || v.name.includes('US') || v.name.includes('American') || v.name.includes('Samantha') || v.name.includes('Alex'))
  ) || availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0];

  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  synth.speak(utterance);
};

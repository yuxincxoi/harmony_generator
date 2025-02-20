import { useState, useEffect } from "react";

export const useAudioContext = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    const initAudio = async () => {
      const context = new AudioContext();
      setAudioContext(context);
    };

    initAudio();
  }, []);

  return audioContext;
};

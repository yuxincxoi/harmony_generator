import React, { useEffect } from "react";
import { useAudioContext } from "./hooks/useAudioContext";
import { useJungleModule } from "./hooks/useJungleModule";
import { useAudioProcessor } from "./hooks/useAudioProcessor";
import RecordBtn from "../src/components/RecordBtn";
import AudioController from "./components/AudioController";
import DownloadBtn from "./components/DownloadBtn";

const AudioProcessor = () => {
  const audioContext = useAudioContext();
  const JungleModule = useJungleModule();
  const { isProcessing, audioURL, processAudio, handleStartStop, cleanup } =
    useAudioProcessor({ audioContext, JungleModule });

  useEffect(() => {
    processAudio();
    return cleanup;
  }, [audioContext, isProcessing, JungleModule]);

  return (
    <div>
      <RecordBtn isProcessing={isProcessing} onClick={handleStartStop} />
      {audioURL && (
        <div className="mt-4">
          <AudioController audioURL={audioURL} />
          <DownloadBtn audioURL={audioURL} />
        </div>
      )}
    </div>
  );
};

export default AudioProcessor;

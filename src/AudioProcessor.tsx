import React, { useEffect } from "react";
import { useAudioContext } from "./hooks/useAudioContext";
import { useJungleModule } from "./hooks/useJungleModule";
import { useAudioProcessor } from "./hooks/useAudioProcessor";
import RecordBtn from "../src/components/RecordBtn";
import AudioController from "./components/AudioController";
import DownloadBtn from "./components/DownloadBtn";

interface ProcessorProps {
  onProcessingChange?: (isProcessing: boolean) => void;
  className?: string;
}

const Processor: React.FC<ProcessorProps> = ({
  onProcessingChange,
  className,
}) => {
  const audioContext = useAudioContext();
  const JungleModule = useJungleModule();
  const { isProcessing, audioURL, processAudio, handleStartStop, cleanup } =
    useAudioProcessor({ audioContext, JungleModule });

  useEffect(() => {
    processAudio();
    return cleanup;
  }, [audioContext, isProcessing, JungleModule]);

  // isProcessing 값이 변경될 때 MainPage에 전달
  useEffect(() => {
    if (onProcessingChange) {
      onProcessingChange(isProcessing);
    }
  }, [isProcessing, onProcessingChange]);

  return (
    <div className={className}>
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

export default Processor;

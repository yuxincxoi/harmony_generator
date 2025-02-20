import React, { useEffect, useState } from "react";
import { useAudioContext } from "./hooks/useAudioContext";
import { useJungleModule } from "./hooks/useJungleModule";
import { useAudioProcessor } from "./hooks/useAudioProcessor";
import RecordBtn from "../src/components/RecordBtn";
import { Modal } from "./components/Modal";
import { ProcessorProps } from "./interfaces/AudioProcessor.interface";

const Processor: React.FC<ProcessorProps> = ({
  onProcessingChange,
  className,
}) => {
  const audioContext = useAudioContext();
  const JungleModule = useJungleModule();
  const { isProcessing, audioURL, processAudio, handleStartStop, cleanup } =
    useAudioProcessor({ audioContext, JungleModule });
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  useEffect(() => {
    // 녹음이 중지되고 audioURL이 있을 때 모달 열기
    if (!isProcessing && audioURL) {
      setIsModalOpen(true);
    }
  }, [isProcessing, audioURL]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center h-screen ${className}`}
    >
      <RecordBtn isProcessing={isProcessing} onClick={handleStartStop} />
      {audioURL && !isProcessing && isModalOpen && (
        <Modal onClose={handleCloseModal} audioURL={audioURL} />
      )}
    </div>
  );
};

export default Processor;

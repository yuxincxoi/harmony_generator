import { useRef, useState } from "react";
import { cleanupAudioResources } from "../utils/cleanup";
import { AudioProcessorHookProps } from "@/interfaces/hooks/useAudioProcessor.interface";

export const useAudioProcessor = ({
  audioContext,
  JungleModule,
}: AudioProcessorHookProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);

  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const jungleRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const processorDestinationRef =
    useRef<MediaStreamAudioDestinationNode | null>(null);

  const processAudio = async () => {
    if (!audioContext || !JungleModule) return;

    try {
      jungleRef.current = new JungleModule(audioContext);
      jungleRef.current.setPitchOffset(0.3);

      if (isProcessing) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        microphoneRef.current = audioContext.createMediaStreamSource(stream);
        processorDestinationRef.current =
          audioContext.createMediaStreamDestination();

        microphoneRef.current.connect(jungleRef.current.input);
        jungleRef.current.output.connect(processorDestinationRef.current);
        jungleRef.current.output.connect(audioContext.destination);

        mediaRecorderRef.current = new MediaRecorder(
          processorDestinationRef.current.stream
        );
        recordedChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(recordedChunksRef.current, {
            type: "audio/m4a",
          });
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioURL(audioUrl);
        };

        mediaRecorderRef.current.start();
      } else {
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stop();
        }
        cleanupAudioResources(microphoneRef, jungleRef);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleStartStop = () => {
    setIsProcessing(!isProcessing);
  };

  return {
    isProcessing,
    audioURL,
    processAudio,
    handleStartStop,
    cleanup: () => cleanupAudioResources(microphoneRef, jungleRef),
  };
};

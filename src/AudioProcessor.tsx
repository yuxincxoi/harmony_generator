import React, { useEffect, useRef, useState } from "react";
import { cleanupAudioResources } from "./utils/cleanup";
import RecordBtn from "../src/components/RecordBtn";
import AudioController from "./components/AudioController";
import DownloadBtn from "./components/DownloadBtn";

const AudioProcessor = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const jungleRef = useRef<any>(null); // Jungle 오디오 프로세서 참조
  const [isProcessing, setIsProcessing] = useState(false); // 음치마이크 실행 여부
  const [JungleModule, setJungleModule] = useState<any>(null); // Jungle 모듈을 동적으로 로드

  // 녹음을 위한 새로운 상태와 ref 추가
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const processorDestinationRef =
    useRef<MediaStreamAudioDestinationNode | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null); // 저장된 오디오 URL

  useEffect(() => {
    // 오디오 처리 초기화
    const initAudio = async () => {
      const context = new AudioContext(); // Web Audio API 기능에 접근하기 위해 인스턴스 생성
      setAudioContext(context);
    };

    initAudio();
  }, []);

  useEffect(() => {
    // Jungle 모듈을 비동기적으로 로드
    const loadJungleModule = async () => {
      try {
        const { default: Jungle } = await import("../lib/jungle.mjs");
        setJungleModule(() => Jungle); // 로드된 Jungle 모듈을 상태로 저장
      } catch (error) {
        console.error("Error loading Jungle module:", error);
      }
    };

    loadJungleModule();
  }, []);

  useEffect(() => {
    if (!audioContext || !JungleModule) return;

    const processAudio = async () => {
      try {
        jungleRef.current = new JungleModule(audioContext);
        jungleRef.current.setPitchOffset(0.3);

        if (isProcessing) {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          }); // 마이크 스트림 얻기
          microphoneRef.current = audioContext.createMediaStreamSource(stream); // 얻은 마이크 스트림 입력 소스를 AudioContext에 전달
          processorDestinationRef.current =
            audioContext.createMediaStreamDestination();

          // 오디오 처리 체인 연결
          microphoneRef.current.connect(jungleRef.current.input); // Jungle 오디오 프로세서에 연결
          jungleRef.current.output.connect(processorDestinationRef.current);
          jungleRef.current.output.connect(audioContext.destination); // 처리된 오디오를 스피커로 출력

          // MediaRecorder 설정
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
          // 녹음 중지
          if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
          }

          // 정리 작업: 처리 중지 시 리소스를 해제
          cleanupAudioResources(microphoneRef, jungleRef);
        }
      } catch (error) {
        console.error(error);
      }
    };

    processAudio();

    // 컴포넌트 언마운트 시 리소스 정리
    return () => {
      cleanupAudioResources(microphoneRef, jungleRef);
    };
  }, [audioContext, isProcessing, JungleModule]);

  const handleStartStop = () => {
    setIsProcessing(!isProcessing);
  };

  return (
    <>
      <div>
        <RecordBtn isProcessing={isProcessing} onClick={handleStartStop} />
        {audioURL && (
          <div className="mt-4">
            <AudioController audioURL={audioURL} />
            <DownloadBtn audioURL={audioURL} />
          </div>
        )}
      </div>
    </>
  );
};

export default AudioProcessor;

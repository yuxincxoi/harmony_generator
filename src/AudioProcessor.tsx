import React, { useEffect, useRef, useState } from "react";
import { cleanupAudioResources } from "./utils/cleanup";

const AudioProcessor = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const jungleRef = useRef<any>(null); // Jungle 오디오 프로세서 참조
  const [isProcessing, setIsProcessing] = useState(false); // 음치마이크 실행 여부
  const [pitchOffset, setPitchOffset] = useState(0.3);
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
        jungleRef.current.setPitchOffset(pitchOffset);

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

          mediaRecorderRef.current.start();
        } else {
          // 녹음 중지 및 파일 저장
          if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state === "recording"
          ) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.onstop = () => {
              const audioBlob = new Blob(recordedChunksRef.current, {
                type: "audio/webm",
              });
              const audioUrl = URL.createObjectURL(audioBlob);

              // 다운로드 링크 생성
              const downloadLink = document.createElement("a");
              downloadLink.href = audioUrl;
              downloadLink.download = "processed-audio.m4a";
              downloadLink.click();

              // 리소스 정리
              URL.revokeObjectURL(audioUrl);
            };
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
  }, [audioContext, isProcessing, pitchOffset, JungleModule]);

  const handleStartStop = () => {
    setIsProcessing(!isProcessing);
  };

  const handlePitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPitchOffset = parseFloat(e.target.value); // 입력받은 피치 값을 숫자로 변환
    setPitchOffset(newPitchOffset);

    if (jungleRef.current) {
      jungleRef.current.setPitchOffset(newPitchOffset); // Jungle 인스턴스의 피치 오프셋 업데이트
    }
  };

  return (
    <>
      <div>
        <div
          className="cursor-pointer mt-16 mx-auto w-60 text-center p-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
          onClick={handleStartStop}
        >
          {isProcessing ? "중단" : "시작"}
        </div>
        <br />
        <div className="flex justify-between pt-16">
          <p>down</p>
          <p>up</p>
        </div>
        <input
          id="pitch"
          type="range"
          min="-1"
          max="1"
          step="0.1"
          value={pitchOffset}
          onChange={handlePitchChange}
          placeholder="PitchChanger"
          className="z-10 mb-1 mt-4 h-2 w-full appearance-none bg-neutral-100 focus:outline-black dark:bg-neutral-900 dark:focus:outline-white [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-black active:[&::-moz-range-thumb]:scale-110 [&::-moz-range-thumb]:dark:bg-white [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:border-none [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:active:scale-110 [&::-webkit-slider-thumb]:dark:bg-white [&::-moz-range-thumb]:rounded-full [&::-webkit-slider-thumb]:rounded-full rounded-full"
        />
      </div>
    </>
  );
};

export default AudioProcessor;

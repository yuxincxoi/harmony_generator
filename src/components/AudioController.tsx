import React, { useRef, useState, useEffect } from "react";
import { AudioControllerProps } from "@/interfaces/components/AudioController.interface";

const AudioController: React.FC<AudioControllerProps> = ({
  audioURL,
  onPlayingChange,
}) => {
  const playBtn = "url('./img/playBtn.png')";
  const pauseBtn = "url('./img/pauseBtn.png')";
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    // 오디오가 끝났을 때 isPlaying을 false로 설정
    const handleEnd = () => {
      setIsPlaying(false);
      onPlayingChange(false);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", handleEnd);
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("ended", handleEnd);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
    onPlayingChange(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(parseFloat(e.target.value));
  };

  // 시간을 mm:ss 형식으로 변환
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (!audioURL) return null;

  return (
    <div className="flex flex-row items-center hover:text-gray-500 transition w-[300px] mt-4">
      <button
        onClick={togglePlay}
        className="w-5 h-5 bg-cover"
        style={{ backgroundImage: isPlaying ? pauseBtn : playBtn }}
        aria-label={isPlaying ? "일시정지" : "재생"}
      ></button>
      <input
        aria-label="progress"
        type="range"
        value={progress}
        onChange={handleSeek}
        className="flex-1 ml-3 bg-black w-1 h-1 rounded-lg accent-black cursor-pointer appearance-none"
      />
      <div className="text-sm ml-3 text-gray-400">
        {formatTime(currentTime)}
      </div>

      {/* 실제 오디오 요소 (숨김) */}
      <audio ref={audioRef} src={audioURL} />
    </div>
  );
};

export default AudioController;

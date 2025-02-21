import React from "react";
import { PlayIconProps } from "@/interfaces/components/PlayIcon.interface";

export const PlayIcon: React.FC<PlayIconProps> = ({ isPlaying }) => {
  const backgroundImg = "url('./img/backgroundImg.jpg')";

  return (
    <div className="relative w-[180px] h-[180px] flex items-center justify-center">
      <div
        className={`absolute w-[180px] h-[180px] rounded-full bg-cover ${
          isPlaying ? "animate-spin-slow" : ""
        }`}
        style={{ backgroundImage: backgroundImg }}
      ></div>
      <div className="absolute w-[55px] h-[55px] rounded-full bg-white shadow-[inset_0px_15px_15px_rgba(0,0,0,0.2)]"></div>
    </div>
  );
};

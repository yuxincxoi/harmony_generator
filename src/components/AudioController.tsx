import React from "react";
import { AudioControllerProps } from "@/interfaces/components/AudioController.interface";

const AudioController: React.FC<AudioControllerProps> = ({ audioURL }) => {
  if (!audioURL) return null;

  return (
    <>
      <audio controls src={audioURL}></audio>
    </>
  );
};

export default AudioController;

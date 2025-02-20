import React from "react";

interface AudioControllerProps {
  audioURL: string | null;
}

const AudioController: React.FC<AudioControllerProps> = ({ audioURL }) => {
  if (!audioURL) return null;

  return (
    <>
      <audio controls src={audioURL}></audio>
    </>
  );
};

export default AudioController;

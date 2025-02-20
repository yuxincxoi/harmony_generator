import React from "react";

interface StartStopButtonProps {
  isProcessing: boolean;
  onClick: () => void;
}

const StartStopButton: React.FC<StartStopButtonProps> = ({
  isProcessing,
  onClick,
}) => {
  return (
    <div
      className="cursor-pointer mt-16 mx-auto w-60 text-center p-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
      onClick={onClick}
    >
      {isProcessing ? "STOP" : "PLAY"}
    </div>
  );
};

export default StartStopButton;

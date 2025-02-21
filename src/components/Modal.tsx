import React from "react";
import ModalProps from "@/interfaces/components/Modal.interface";
import AudioController from "./AudioController";
import DownloadBtn from "./DownloadBtn";
import { PlayIcon } from "./PlayIcon";

export const Modal: React.FC<ModalProps> = ({ onClose, audioURL }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-[650px] h-[500px] bg-white rounded-xl relative">
        <button
          className="absolute right-4 top-2 text-gray-700 font-thin text-lg cursor-pointer hover:text-gray-400 transition-colors"
          onClick={onClose}
        >
          X
        </button>
        <PlayIcon />
        <div className="pt-8">
          <AudioController audioURL={audioURL} />
          <DownloadBtn audioURL={audioURL} />
        </div>
      </div>
    </div>
  );
};

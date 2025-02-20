import React from "react";
import ModalProps from "@/interfaces/components/Modal.interface";
import AudioController from "./AudioController";
import DownloadBtn from "./DownloadBtn";

export const Modal: React.FC<ModalProps> = ({ onClose, audioURL }) => {
  return (
    <div className="w-[400px] h-[250px] bg-black rounded-xl">
      <div
        className="text-right mr-4 mt-2 font-thin text-lg cursor-pointer"
        onClick={onClose}
      >
        X
      </div>
      <div>
        <AudioController audioURL={audioURL} />
        <DownloadBtn audioURL={audioURL} />
      </div>
    </div>
  );
};

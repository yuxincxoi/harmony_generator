import React from "react";
import { DownloadBtnProps } from "@/interfaces/components/DownloadBtn.interface";

const DownloadBtn: React.FC<DownloadBtnProps> = ({ audioURL }) => {
  return (
    <a href={audioURL} download="processed_audio.m4a">
      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2 w-full">
        Download
      </button>
    </a>
  );
};

export default DownloadBtn;

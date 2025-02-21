import React from "react";
import { DownloadBtnProps } from "@/interfaces/components/DownloadBtn.interface";

const DownloadBtn: React.FC<DownloadBtnProps> = ({ audioURL }) => {
  const downloadBtn = "url('./img/downloadBtn.png')";

  return (
    <a href={audioURL} download="processed_audio.m4a">
      <button
        title="download"
        className="w-5 h-5 mt-4 ml-5 bg-cover cursor-pointer"
        style={{ backgroundImage: downloadBtn }}
      ></button>
    </a>
  );
};

export default DownloadBtn;

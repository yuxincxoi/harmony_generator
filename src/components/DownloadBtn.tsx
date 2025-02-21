import React, { useState } from "react";
import { DownloadBtnProps } from "@/interfaces/components/DownloadBtn.interface";

const DownloadBtn: React.FC<DownloadBtnProps> = ({ audioURL }) => {
  const downloadBtn = "url('./img/downloadBtn.png')";
  const checkImg = "url('./img/checkImg.png')";

  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleDownloadComplete = () => {
    setIsDownloaded(true);
  };

  return (
    <a
      href={audioURL}
      download="processed_audio.m4a"
      onClick={handleDownloadComplete}
    >
      <button
        title="download"
        className="w-5 h-5 mt-4 ml-5 bg-cover cursor-pointer"
        style={{ backgroundImage: isDownloaded ? checkImg : downloadBtn }}
      ></button>
    </a>
  );
};

export default DownloadBtn;

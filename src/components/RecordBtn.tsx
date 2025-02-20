import React from "react";
import { RecordBtnProps } from "@/interfaces/components/RecordBtn.interface";

const RecordBtn: React.FC<RecordBtnProps> = ({ isProcessing, onClick }) => {
  const recordImg = "url('./img/recordImg.png')";
  const backgroundImg = "url('./img/backgroundImg.jpg')";

  return (
    <div
      className="cursor-pointer relative w-[270px] h-[270px] flex items-center justify-center"
      onClick={onClick}
    >
      <div className="absolute bg-white w-[270px] h-[270px] rounded-full"></div>
      <div
        className="absolute w-[260px] h-[260px] rounded-full bg-cover"
        style={{ backgroundImage: backgroundImg }}
      ></div>
      <div className="absolute w-[245px] h-[245px] bg-white rounded-full"></div>
      <div className="absolute bg-white rounded-full">
        <div
          className="w-[100px] h-[100px] bg-contain"
          style={{ backgroundImage: isProcessing ? "hi" : recordImg }}
        ></div>
      </div>
    </div>
  );
};

export default RecordBtn;

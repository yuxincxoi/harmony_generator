import React from "react";

export const PlayIcon = () => {
  const backgroundImg = "url('./img/backgroundImg.jpg')";

  return (
    <div className="relative w-[180px] h-[180px] flex items-center justify-center">
      <div
        className="absolute w-[180px] h-[180px] rounded-full bg-cover"
        style={{ backgroundImage: backgroundImg }}
      ></div>
      <div className="absolute w-[55px] h-[55px] rounded-full bg-white shadow-[inset_0px_15px_15px_rgba(0,0,0,0.2)]"></div>
    </div>
  );
};

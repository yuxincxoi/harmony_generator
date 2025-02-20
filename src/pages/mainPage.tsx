import React, { useState } from "react";
import Processor from "../AudioProcessor";

const MainPage: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const backgroundImg = "url('./img/backgroundImg.jpg')";

  return (
    <div className="relative w-screen h-screen">
      <div
        className={`absolute inset-0 w-full h-full  bg-center bg-cover transition-opacity duration-1000 ease-in-out ${
          isProcessing ? "opacity-100" : "opacity-0"
        }`}
        style={{ backgroundImage: backgroundImg }}
      />
      <div
        className={`absolute inset-0 w-full h-full bg-white transition-opacity duration-1000 ease-in-out ${
          isProcessing ? "opacity-0" : "opacity-100"
        }`}
      />
      <Processor className="relative" onProcessingChange={setIsProcessing} />
    </div>
  );
};

export default MainPage;

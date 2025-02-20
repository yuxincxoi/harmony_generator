import React, { useState } from "react";
import Processor from "../AudioProcessor";

const MainPage: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const backgroundImg = "url('./img/backgroundImg.jpg')";

  return (
    <div
      className={`w-screen h-screen bg-cover transition-all duration-1000`}
      style={{
        backgroundImage: isProcessing ? backgroundImg : "none",
        backgroundColor: isProcessing ? "transparent" : "white",
      }}
    >
      <Processor className="relative" onProcessingChange={setIsProcessing} />
    </div>
  );
};

export default MainPage;

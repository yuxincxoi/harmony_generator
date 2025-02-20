import React from "react";
import Processor from "../AudioProcessor";

const MainPage: React.FC = () => {
  const backgroundImg = "url('./img/backgroundImg.jpg')";

  return (
    <div
      className={`w-screen h-screen bg-cover transition-all duration-1000`}
      style={{
        backgroundImage: backgroundImg,
      }}
    >
      <Processor />
    </div>
  );
};

export default MainPage;

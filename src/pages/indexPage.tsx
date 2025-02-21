// IndexPage.tsx
import React, { useState, useEffect } from "react";

const IndexPage: React.FC = () => {
  const [fadeOut, setFadeOut] = useState(false);
  const introImg = "url('./img/introImg.png')";

  useEffect(() => {
    setTimeout(() => {
      setFadeOut(true);
    }, 1500);
  }, []);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center h-screen transition-opacity duration-1000 ease-in-out ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className="bg-contain bg-no-repeat relative w-96 h-40 flex items-center justify-center"
        style={{ backgroundImage: introImg }}
      ></div>
    </div>
  );
};

export default IndexPage;

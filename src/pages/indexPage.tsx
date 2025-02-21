import React, { useState } from "react";

const IndexPage: React.FC = () => {
  const introImg = "url('./img/introImg.png')";
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center h-screen">
        <div
          className="bg-contain bg-no-repeat relative w-96 h-40 flex items-center justify-center"
          style={{ backgroundImage: introImg }}
        ></div>
      </div>
    </>
  );
};

export default IndexPage;

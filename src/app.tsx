import React from "react";
import Processor from "./AudioProcessor";

const App: React.FC = () => {
  return (
    <div className="w-60 m-auto pt-52">
      <h1 className="text-3xl text-center font-extrabold bg-red-300">
        harmony generator
      </h1>
      <Processor />
    </div>
  );
};

export default App;

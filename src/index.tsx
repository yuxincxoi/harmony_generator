import React from "react";
import App from "./app";
import ReactDOM from "react-dom/client";
import "./global.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(<App />);

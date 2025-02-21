import React, { useState, useEffect } from "react";
import MainPage from "./pages/mainPage";
import IndexPage from "./pages/indexPage";

const App: React.FC = () => {
  const [isIndexPage, setIsIndexPage] = useState(true);

  useEffect(() => {
    if (isIndexPage) {
      setTimeout(() => {
        setIsIndexPage(false);
      }, 2500);
    }
  }, [isIndexPage]);

  return isIndexPage ? <IndexPage /> : <MainPage />;
};

export default App;

import { useState, useEffect } from "react";

export const useJungleModule = () => {
  const [JungleModule, setJungleModule] = useState<any>(null);

  useEffect(() => {
    const loadJungleModule = async () => {
      try {
        const { default: Jungle } = await import("../../lib/jungle.mjs");
        setJungleModule(() => Jungle);
      } catch (error) {
        console.error("Error loading Jungle module:", error);
      }
    };

    loadJungleModule();
  }, []);

  return JungleModule;
};

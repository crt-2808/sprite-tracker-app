import { useState } from "react";

export const useSprite = (initialDiscovered = false) => {
  const [discovered, setisDiscovered] = useState(initialDiscovered);

  const toggleDiscovered = () => {
    setisDiscovered((prev) => !prev);
  };

  return {
    //Props
    discovered,

    //Methods
    toggleDiscovered,
  };
};

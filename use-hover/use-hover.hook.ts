import { useState, useRef, useCallback } from "react";

export const useHover = <T extends HTMLElement>() => {
  const [hovering, setHovering] = useState(false);

  const previousEle = useRef<T | null>(null);
  const handleMouseEnter = useCallback(() => {
    setHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovering(false);
  }, []);

  const ref = useCallback(
    (ele: T) => {
      if (!ele) {
        previousEle.current?.removeEventListener(
          "mouseenter",
          handleMouseEnter
        );
        previousEle.current?.removeEventListener(
          "mouseleave",
          handleMouseLeave
        );
      } else {
        ele.addEventListener("mouseenter", handleMouseEnter);
        ele.addEventListener("mouseleave", handleMouseLeave);
      }

      previousEle.current = ele;
    },
    [handleMouseEnter, handleMouseLeave]
  );

  return { ref, hovering };
};

import { useCallback, useEffect, useState } from "react";

export const useDragNDrop = (onScrollY?: (movementY: number) => void) => {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [mousedown, setMouseDown] = useState(-1);

  const mouseDownCallback = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      setMouseDown(e.pageY);
    },
    [setMouseDown]
  );

  const mouseUpCallback = useCallback(
    (e: MouseEvent) => {
      if (isMouseDown(mousedown)) {
        setMouseDown(-1);
      }
    },
    [mousedown, setMouseDown]
  );

  const mouseMoveCallback = useCallback(
    (e: MouseEvent) => {
      if (isMouseDown(mousedown) && onScrollY) {
        onScrollY(e.movementY);
      }
    },
    [mousedown, onScrollY]
  );

  useEffect(() => {
    document.addEventListener("mouseup", mouseUpCallback);
    document.addEventListener("mousemove", mouseMoveCallback);

    return () => {
      document.removeEventListener("mouseup", mouseUpCallback);
      document.removeEventListener("mousemove", mouseMoveCallback);
    };
  }, [mouseUpCallback, mouseMoveCallback]);

  const attachDragNDropNode = useCallback(
    (el: HTMLElement | null) => {
      if (node) {
        node.removeEventListener("mousedown", mouseDownCallback);
      }

      if (el) {
        el.addEventListener("mousedown", mouseDownCallback);
      }

      setNode(el);
    },
    [node, setNode, mouseDownCallback]
  );

  return { attachDragNDropNode };
};

const isMouseDown = (mousedown: number) => {
  return mousedown !== -1;
};

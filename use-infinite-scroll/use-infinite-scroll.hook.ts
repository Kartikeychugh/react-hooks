import { useRef, useCallback } from "react";

export const useInfiniteScroll = (
  callback: () => void,
  options?: IntersectionObserverInit | undefined
) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const observeeRef = useRef<HTMLDivElement | null>(null);

  const rootRef = useCallback(
    (ele: HTMLDivElement | null) => {
      if (ele) {
        observerRef.current = new IntersectionObserver(
          (entry, observer) => {
            if (entry[0].isIntersecting) {
              callback();
              if (observeeRef.current) {
                observer.unobserve(observeeRef.current);
              }
            }
          },
          {
            root: ele,
            ...options,
          }
        );
      } else {
        observerRef.current?.disconnect();
        observerRef.current = null;
      }
    },
    [callback, options]
  );

  const childRef = useCallback((ele: HTMLDivElement | null) => {
    if (ele) {
      if (observerRef.current) {
        observerRef.current.observe(ele);
      }
    } else {
      if (observerRef.current && observeeRef.current) {
        observerRef.current.unobserve(observeeRef.current);
      }
    }
    observeeRef.current = ele;
  }, []);

  return { rootRef, childRef };
};

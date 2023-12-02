import { useState, useRef, useCallback, useEffect } from "react";

interface IMeasurements {
  from: number;
  to: number;
  height: number;
}

export const useVirtualScroll = (
  data: Omit<IMeasurements, "from" | "to">[],
  pageSize = 5
) => {
  const [range, setRange] = useState({ start: -1, end: -1 });
  const scrollTopRef = useRef(0);
  const dimensionsRef = useRef<IMeasurements[]>([]);
  const windowRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = useCallback(() => {
    const scrollTop = scrollTopRef.current;
    const start = binarySearch(dimensionsRef.current, scrollTop);
    const end = Math.min(
      start + pageSize - 1,
      dimensionsRef.current.length - 1
    );
    setRange({ start, end });
  }, [pageSize]);

  const scrollListener = useCallback(
    (e: Event) => {
      scrollTopRef.current = (e.target as HTMLElement).scrollTop;
      handleScroll();
    },
    [handleScroll]
  );

  const viewPortRef = useCallback(
    (ele: HTMLDivElement | null) => {
      if (ele) {
        ele.addEventListener("scroll", scrollListener);
      } else {
        windowRef.current?.removeEventListener("scroll", scrollListener);
      }
      windowRef.current = ele;
    },
    [scrollListener]
  );

  useEffect(() => {
    let from = 0;
    dimensionsRef.current = data.map(({ height }) => {
      const to = from + height;
      const record = { from, to, height };
      from = to;
      return record;
    });
    handleScroll();

    return () => {
      dimensionsRef.current = [];
    };
  }, [data, handleScroll]);

  return { viewPortRef, range };
};

function binarySearch(arr: IMeasurements[], target: number) {
  let l = 0,
    r = arr.length - 1;
  let ans = -1;
  while (l <= r) {
    const m = (l + r) >> 1;
    if (arr[m].to <= target) {
      ans = m;
      l = m + 1;
    } else {
      r = m - 1;
    }
  }
  return ans + 1;
}

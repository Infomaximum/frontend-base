import { useEffect, useState } from "react";

/** Округление до сотых */
const rounding = (num: number) => {
  return parseFloat(num.toFixed(2));
};

export const useZoomRatio = () => {
  const [zoomRatio, setZoomRatio] = useState<number>(rounding(window.devicePixelRatio));

  useEffect(() => {
    const onSizeChange = () => {
      setZoomRatio(rounding(window.devicePixelRatio));
    };

    window.addEventListener("resize", onSizeChange);

    return () => window.removeEventListener("resize", onSizeChange);
  }, []);

  return zoomRatio;
};

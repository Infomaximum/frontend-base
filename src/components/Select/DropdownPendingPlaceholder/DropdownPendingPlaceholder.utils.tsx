import { useEffect, useState } from "react";

export function useLastLoaded<T>(
  loading: boolean,
  isDataLoaded: boolean,
  createValue: () => T
) {
  const [value, setValue] = useState<T | null>(null);

  useEffect(() => {
    if (!isDataLoaded) {
      setValue(null);
    } else if (!loading) {
      setValue(createValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, isDataLoaded]);

  return value;
}

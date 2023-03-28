import { useDelayedValue } from "./useDelayedValue";

export const useDelayedTrue = (value: boolean, delay: number) => {
  return useDelayedValue(value, value ? delay : 0) ?? false;
};

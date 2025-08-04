import { noop } from "lodash";
import { createContext } from "react";

export interface ISystemLoaderCallbackOptions {
  debugKey?: string;
  id: string;
}

export type TSystemLoaderContextValue = {
  showSystemLoader: (options: ISystemLoaderCallbackOptions) => void;
  hideSystemLoader: (options: ISystemLoaderCallbackOptions) => void;
  isLoading: () => boolean;
};

export const SystemLoaderContext = createContext<TSystemLoaderContextValue>({
  showSystemLoader: noop,
  hideSystemLoader: noop,
  isLoading: () => true,
});

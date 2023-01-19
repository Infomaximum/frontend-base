import { ConfigsServiceLocator } from "@im/core";
import { useMemo } from "react";

export const useExtension: typeof ConfigsServiceLocator.resolve = (extension) => {
  const extensionInstance = useMemo(() => ConfigsServiceLocator.resolve(extension), [extension]);

  return extensionInstance;
};

import { getInstanceExt } from "@im/core";

export const useExtension: typeof getInstanceExt = (extension) => getInstanceExt(extension);

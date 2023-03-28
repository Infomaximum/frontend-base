import { getInstanceExt } from "@infomaximum/module-expander";

export const useExtension: typeof getInstanceExt = (extension) => getInstanceExt(extension);

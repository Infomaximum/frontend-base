import { find, includes } from "lodash";
import type { IContentConfig } from "./OptionalDrawerForm.types";

export const optionalDrawerFormSelect = "optionalDrawerFormSelect";

export const extractActiveContent = (
  activeOption: string | undefined,
  configs: IContentConfig[] | undefined
) => find(configs, ({ matchOptions }) => includes(matchOptions, activeOption));

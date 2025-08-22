import type { Localization } from "@infomaximum/localization";
import type { NCore } from "@infomaximum/base/src/libs/core";

export interface ISettingsGroupProps {
  title: ReturnType<Localization["getLocalized"]>;
  routes: NCore.IRoute[] | undefined;
}

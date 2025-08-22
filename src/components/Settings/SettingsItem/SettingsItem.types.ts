import type { Localization } from "@infomaximum/localization";
import type { NCore } from "@infomaximum/base/src/libs/core";

export interface ISettingsItemProps {
  title: ReturnType<Localization["getLocalized"]>;
  routes: NCore.IRoute[] | undefined;
  onClick?: () => void;
}

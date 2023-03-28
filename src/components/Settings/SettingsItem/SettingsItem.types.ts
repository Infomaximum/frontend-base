import type { Localization } from "@infomaximum/localization";
import type { NCore } from "@infomaximum/module-expander";

export interface ISettingsItemProps {
  title: ReturnType<Localization["getLocalized"]>;
  routes: NCore.IRoutes[] | undefined;
  onClick?: () => void;
}

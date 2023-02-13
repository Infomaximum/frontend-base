import type { Localization } from "@im/localization";
import type { NCore } from "@im/core";

export interface ISettingsItemProps {
  title: ReturnType<Localization["getLocalized"]>;
  routes: NCore.IRoutes[] | undefined;
  onClick?: () => void;
}

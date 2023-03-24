import type { NCore } from "@infomaximum/module-expander";

export interface ISettingsProps extends Partial<NCore.TRouteComponentProps> {
  routes: NCore.IRoutes[];
  onItemClick?: () => void;
}

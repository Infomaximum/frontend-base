import type { NCore } from "@im/core";

export interface ISettingsProps extends Partial<NCore.TRouteComponentProps> {
  routes: NCore.IRoutes[];
  onItemClick?: () => void;
}

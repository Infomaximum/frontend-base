import type { NCore } from "../../libs/core";

export interface ISettingsProps extends Partial<NCore.TRouteComponentProps> {
  routes: NCore.IRoute[];
  onItemClick: () => void;
}

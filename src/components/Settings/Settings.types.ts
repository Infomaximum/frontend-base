import type { NCore } from "@infomaximum/base/src/libs/core";

export interface ISettingsProps extends Partial<NCore.TRouteComponentProps> {
  routes: NCore.IRoute[];
  onItemClick: () => void;
}

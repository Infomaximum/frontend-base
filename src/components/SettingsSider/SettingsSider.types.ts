import type { NCore } from "../../libs/core";

export interface ISettingsProps extends Partial<NCore.TRouteComponentProps> {
  zoomRatio: number;
}

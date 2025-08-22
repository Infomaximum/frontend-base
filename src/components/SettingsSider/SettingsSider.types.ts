import type { NCore } from "@infomaximum/base/src/libs/core";

export interface ISettingsProps extends Partial<NCore.TRouteComponentProps> {
  zoomRatio: number;
}

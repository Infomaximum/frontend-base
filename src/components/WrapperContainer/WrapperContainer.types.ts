import type React from "react";
import type { NCore } from "@infomaximum/base/src/libs/core";

export interface IWrapperContainerProps extends NCore.TRouteComponentProps {
  component: React.ComponentType<NCore.TRouteComponentProps>;
}

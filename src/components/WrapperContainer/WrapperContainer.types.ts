import type React from "react";
import type { NCore } from "../../libs/core";

export interface IWrapperContainerProps extends NCore.TRouteComponentProps {
  component: React.ComponentType<NCore.TRouteComponentProps>;
}

import type React from "react";
import type { NCore } from "@im/core";

export interface IWrapperContainerProps extends NCore.TRouteComponentProps {
  component: React.ComponentType<NCore.TRouteComponentProps>;
}

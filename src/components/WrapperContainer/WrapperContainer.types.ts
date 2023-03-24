import type React from "react";
import type { NCore } from "@infomaximum/module-expander";

export interface IWrapperContainerProps extends NCore.TRouteComponentProps {
  component: React.ComponentType<NCore.TRouteComponentProps>;
}

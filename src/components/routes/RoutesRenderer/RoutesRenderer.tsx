import type React from "react";
import { memo } from "react";
import { useRoutes } from "react-router";
import type { IRoutesRendererProps } from "./RoutesRenderer.types";

const RoutesRenderer: React.FC<IRoutesRendererProps> = ({ routes }) => {
  const renderedRoutes = useRoutes(routes);

  return <>{renderedRoutes}</>;
};

export default memo(RoutesRenderer);

import { assertSimple } from "@im/asserts";
import { memo } from "react";
import { useLocation, useMatch, useNavigate } from "react-router";
import type { IRouteElementProps } from "./RouteElement.types";

const RouteElementComponent: React.FC<IRouteElementProps> = ({ route }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const match = useMatch({ path: route.path || "", end: !!route.exact });

  assertSimple(
    !!route.component,
    `Для роута "${route.key}" не задан component`
  );

  const RouteComponent = route.component;

  if (!match) {
    return null;
  }

  return (
    <RouteComponent
      route={route}
      location={location}
      navigate={navigate}
      match={match}
    />
  );
};

export const RouteElement = memo(RouteElementComponent);

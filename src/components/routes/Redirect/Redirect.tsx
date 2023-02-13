import { memo, useMemo } from "react";
import { Navigate, generatePath, useParams, useLocation } from "react-router";
import type { IRedirectProps } from "./Redirect.types";

export const RedirectComponent: React.FC<IRedirectProps> = ({
  to,
  stateGetter,
}) => {
  const params = useParams();
  const location = useLocation();

  const state = useMemo(
    () => stateGetter && stateGetter(location),
    [location, stateGetter]
  );

  return (
    <Navigate to={generatePath(to, params)} state={state} replace={true} />
  );
};

export const Redirect = memo(RedirectComponent);

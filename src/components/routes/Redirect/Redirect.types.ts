import type { NavigateProps, Location } from "react-router";

export interface IRedirectProps {
  to: string;
  stateGetter?: (location: Location) => NavigateProps["state"];
}

import type { Location } from "react-router";
import type { History } from "history";

export interface IWithLocationProps<
  S extends Location["state"] = Location["state"]
> {
  location: Location & { state: S };
  listenLocationChange: History["listen"];
}

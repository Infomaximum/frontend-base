import type { Location } from "react-router";
import type { HistoryStore } from "../../../utils";

export interface IWithLocationProps<S extends Location["state"] = Location["state"]> {
  location: Location & { state: S };
  listenLocationChange: HistoryStore["listenLocationChange"];
}

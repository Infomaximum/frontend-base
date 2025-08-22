import type { Location } from "react-router";
import type { HistoryStore } from "@infomaximum/base/src/utils";

export interface IWithLocationProps<S extends Location["state"] = Location["state"]> {
  location: Location & { state: S };
  listenLocationChange: HistoryStore["listenLocationChange"];
}

import "./global.types";
import "./svg.types";

import { configure } from "mobx";

configure({
  useProxies: "never",
  enforceActions: "always",
  computedRequiresReaction: false,
  reactionRequiresObservable: false,
  observableRequiresReaction: false,
  disableErrorBoundaries: true,
});

export * from "./decorators";
export * from "./managers";
export * from "./resources";
export * from "./styles";
export * from "./utils";

export * from "@im/localization";
export * from "@im/asserts";

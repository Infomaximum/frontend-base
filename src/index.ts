/// <reference path="./global.types.ts" />
/// <reference path="./svg.types.ts" />

/// <reference path="components/index.ts" />
/// <reference path="layouts/index.ts" />
/// <reference path="models/index.ts" />
/// <reference path="libs/core/index.ts" />
/// <reference path="libs/utils/index.ts" />

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

/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./global.types.ts" />
/// <reference path="./svg.types.ts" />

/// <reference path="components/index.ts" />
/// <reference path="layouts/index.ts" />
/// <reference path="models/index.ts" />
/// <reference path="store/index.ts" />
/// <reference path="libs/core/index.ts" />
/// <reference path="libs/utils/index.ts" />

import { configure } from "mobx";

configure({
  enforceActions: "always",
  computedRequiresReaction: false,
  reactionRequiresObservable: false,
  observableRequiresReaction: false,
  disableErrorBoundaries: true,
});

// Определение пути, по которому лежат chunks динамических импортов
__webpack_public_path__ = `${window.im.system.apiPrefix ?? ""}/`;

export * from "./decorators";
export * from "./managers";
export * from "./resources";
export * from "./styles";
export * from "./utils";

export * from "@infomaximum/localization";
export * from "@infomaximum/assert";

import { requireAll, requireAllModels } from "@im/utils";
import { getBaseRoutes } from "./configs/routes.config";
import { getBaseErrorHandlers } from "./utils/Errors/ErrorHandlers";
import { ModuleExpander, defineModule, IModuleExpander, NCore } from "@im/core";
import typenameToModel from "@im/platform/src/models/typenameToModel";
import { PlatformModule } from "@im/platform/src/index.module";

const getModelsBaseConfig = () => {
  const models = requireAllModels(require.context("./models", true, /\.[j,t]sx?$/));

  typenameToModel.registrationModels(models);
};

const getExtendersBaseConfig: NCore.TExtendersConfigFunc = () =>
  requireAll(require.context("./extenders", true, /^\.\/.*\.ext\.[j,t]sx?$/));

export class BaseModule extends ModuleExpander implements IModuleExpander {}

defineModule({
  injectParams: {
    moduleName: "com.infomaximum.subsystem.base",
    /* fixme: проверить список зависимостей (dependencies) и удалить комментарий ниже!!
    нужно добавить массив прямых зависимостей модуля, например [PlatformModule , ...другие зависимости],
    так же зависимоcти надо добавить в tsconfig.json и в packages.json
    */
    dependencies: [PlatformModule],
  },

  routesConfig: getBaseRoutes,
  errorsConfig: getBaseErrorHandlers,
  modelsConfig: getModelsBaseConfig,
  extendersConfig: getExtendersBaseConfig,
})(BaseModule)


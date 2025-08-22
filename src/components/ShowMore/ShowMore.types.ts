import type { Group } from "@infomaximum/graphql-model";
import type { ELimitsStateNames } from "@infomaximum/base/src/utils/const";
import type { RestModel } from "@infomaximum/base/src/models/RestModel";
import type { TableStore } from "@infomaximum/base/src/utils/Store/TableStore/TableStore";
import type { IWithLocProps } from "@infomaximum/base/src/decorators/hocs/withLoc/withLoc";
import type { IWithThemeProps } from "@infomaximum/base/src/decorators/hocs/withTheme/withTheme";

export interface IShowMoreOwnProps {
  tableStore: TableStore<Group>;
  model: RestModel;
  limitStateName: ELimitsStateNames;
  mode?: "link" | "ghost" | "scrolling";
  /**
   * Дополнительные переменные для выполнения запроса
   */
  queryVariables?: TDictionary;
}

export interface IShowMoreProps extends IShowMoreOwnProps, IWithLocProps, IWithThemeProps<TTheme> {}

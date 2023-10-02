import type { Group } from "@infomaximum/graphql-model";
import type { ELimitsStateNames } from "../../utils/const";
import type { RestModel } from "../../models/RestModel";
import type { TableStore } from "../../utils/Store/TableStore/TableStore";
import type { IWithLocProps } from "../../decorators/hocs/withLoc/withLoc";
import type { IWithThemeProps } from "../../decorators/hocs/withTheme/withTheme";

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

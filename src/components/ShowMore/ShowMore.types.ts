import type { Model } from "@im/models";
import type { ELimitsStateNames } from "src/utils/const";
import type RestModel from "src/models/RestModel";
import type TableStore from "src/utils/Store/TableStore/TableStore";
import type { IWithLocProps } from "src/decorators/hocs/withLoc/withLoc";

export interface IShowMoreOwnProps {
  tableStore: TableStore<Model>;
  model: RestModel;
  limitStateName: ELimitsStateNames;
  mode?: "link" | "ghost";
  /**
   * Дополнительные переменные для выполнения запроса
   */
  queryVariables?: TDictionary;
}

export interface IShowMoreProps extends IShowMoreOwnProps, IWithLocProps {}

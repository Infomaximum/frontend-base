import type { IWithLocProps, Model } from "@im/utils";
import type { ELimitsStateNames } from "@im/base/src/utils/const";
import type RestModel from "@im/base/src/models/RestModel";
import type TableStore from "@im/base/src/utils/Store/TableStore/TableStore";

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

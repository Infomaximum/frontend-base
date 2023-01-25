import type { Model } from "@im/models";
import type { ELimitsStateNames } from "../../utils/const";
import type RestModel from "../../models/RestModel";
import type TableStore from "../../utils/Store/TableStore/TableStore";
import type { IWithLocProps } from "../../decorators/hocs/withLoc/withLoc";

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

import type { Group, IModel, Model } from "@infomaximum/graphql-model";
import type { Store } from "../../utils/Store";
import type { ISelectProps } from "../Select/Select.types";

export type THandlerDisplayValues = (value: IModel) => React.ReactNode;

export interface ISelectWithStoreProps
  extends Omit<
    ISelectProps,
    | "value"
    | "defaultValue"
    | "options"
    | "children"
    | "onChange"
    | "optionFilterProp"
    | "notFountContent"
    | "filterOption"
  > {
  store: Store<Group>;
  dataAccessKeys?: string[];
  value?: Model[];
  onChange?: (model: Model[]) => void;
  requestOnMount?: boolean;
  queryVariables?: TDictionary;
  clearDataOnClose?: boolean;
  handlerDisplayValues?: THandlerDisplayValues;
  handlerDisplaySelectedValues?: THandlerDisplayValues;
}

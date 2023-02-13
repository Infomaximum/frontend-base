import type { Group, Model } from "@im/models";
import type { Store } from "../../utils/Store";
import type { ISelectProps } from "../Select/Select.types";

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
}

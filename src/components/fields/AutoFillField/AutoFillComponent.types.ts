import type { Key } from "react";
import type { Interpolation } from "@emotion/react";
import type { IAutoCompleteProps } from "../AutoCompleteField/AutoCompleteFormField/AutoCompleteField.types";
import type { AutoCompleteStore } from "../../../utils/Store/AutoCompleteStore/AutoCompleteStore";
import type { IModel } from "@infomaximum/graphql-model";
import type { IWithLocProps } from "../../../decorators/hocs/withLoc/withLoc";

type TAutoCompleteProps = Omit<IAutoCompleteProps, "onChange" | "value">;

interface IAutoFillComponentOwnProps extends TAutoCompleteProps {
  autocompleteStore: AutoCompleteStore;
  value: IModel;
  queryVariables?: TDictionary;
  /** делать ли запрос при монтировании автокомплита */
  requestOnMount?: boolean;
  /**
   * callback-функция, которая будет вызвана при изменении значения автокомплита
   */
  onSelectCallback?: (value: IModel) => void;
  onBlur?(): void;
  onFocus?(): void;
  onChange?(value?: IModel): void;
  rowDisable?: (model: IModel) => boolean;
  "test-id"?: string;
  /** Есть ли доступ к данным автокомплита*/
  isHasAccess?: boolean;
  autoFillComponentStyle?: Interpolation<TTheme>;
  getPrepareDisplayValue?: (value: string | undefined) => string;
}

export interface IAutoFillComponentProps extends IAutoFillComponentOwnProps, IWithLocProps {}

export interface IAutoFillComponentState {
  searchText: string | undefined;

  isOpenedDropdown: boolean;
  /** Был ли открыт dropdown */
  hasBeenOpenedDropdown: boolean;
}

export type TAutoFillOption = {
  key: Key;
  value: string;
  title: string;
  disabled: boolean;
};

import type { ISelectProps } from "../../../Select/Select.types";
import type { IWithLocProps } from "../../../../decorators/hocs/withLoc/withLoc";
import type { AutoCompleteStore } from "../../../../utils/Store/AutoCompleteStore/AutoCompleteStore";
import type { IModel } from "@infomaximum/graphql-model";
import type { TRowDisable } from "../../../DataTable/DataTable.types";

export interface ISelectComponentProps
  extends Omit<
      ISelectProps<any>,
      "value" | "onChange" | "notFoundContent" | "virtual" | "listItemHeight"
    >,
    IWithLocProps {
  autocompleteStore: AutoCompleteStore;
  value?: IModel[];
  onSuffixClick?(e?: React.SyntheticEvent<Element>): void;
  onBlur?(): void;
  onFocus?(): void;
  onChange(value?: IModel[]): void;
  hintContainer?: React.ReactNode;
  queryVariables?: TDictionary;
  rowDisable?: TRowDisable;
  /**
   * делать ли запрос при монтировании автокомплита
   */
  requestOnMount?: boolean;

  /**
   * обработчик отображаемых значений в автокомплите/селекте
   */
  handlerDisplayValues?: (value: IModel) => React.ReactNode;
  /**
   * обработчик всплывающих значений в автокомплите/селекте
   */
  handlerTitleValues?: (value: IModel) => string | undefined;
  /**
   * обработчик отображения выбранных значений в автокомплите/селекте
   * (нужен что бы перехватить значение initialValues)
   */
  handlerDisplaySelectedValues?: (value: IModel) => React.ReactNode;

  labelPropsGetter?: (
    value: IModel
  ) => React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
  "test-id"?: string;
  /** Есть ли доступ к данным селекта*/
  isHasAccess?: boolean;
  /**
   * Нужна ли группировка
   * @param model: IModel
   * @return строка по которой сгруппируются значения
   */
  groupBy?(model: IModel): string;
  /**
   * Нужен ли тултип в значениях селекта
   */
  isVisibleOptionsTooltip?: boolean;
}

export interface ISelectState {
  searchText?: string;
  /** Был ли открыт dropdown */
  hasBeenOpenedDropdown: boolean;
  isDropdownOpened: boolean;
  wasDataSearched: boolean;
  isFocused: boolean;
}

export interface IValue {
  key: string;
  label: string | React.ReactNode;
}

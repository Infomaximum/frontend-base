import type { FieldRenderProps } from "react-final-form";
import type { IAutoCompleteProps as IAutoCompleteInternalProps } from "../../AutoComplete/AutoComplete.types";
import type { IModel } from "@im/models";
import type { IFieldProps } from "../FormField/Field/Field.types";
import type { IFormFieldProps } from "../FormField/FormField.types";
import type { AutoCompleteStore } from "../../../utils/Store/AutoCompleteStore/AutoCompleteStore";
import type { TRowDisable } from "../../DataTable/DataTable.types";

export type TAutoFillFieldValue = IModel;

export interface IAutoFillProps extends IAutoFillOwnProps, FieldRenderProps<any> {}

export interface IAutoFillOwnProps
  extends Omit<
    IAutoCompleteInternalProps,
    "onChange" | "onFocus" | "onBlur" | "value" | "notFoundContent"
  > {
  /**
   * Делать ли запрос при монтировании автокомплита
   */
  requestOnMount?: boolean;

  /**
   * callback-функция, которая будет вызвана при изменении значения автокомплита
   */
  onSelectCallback?: (value: TAutoFillFieldValue) => void;

  /**
   * Экземпляр Autocomplete-store возможных значений поля
   */
  autocompleteStore: AutoCompleteStore;

  /**
   * Переменные запроса
   */
  queryVariables?: TDictionary;

  /**
   * Функция блокирования строки по какому-либо признаку, принимает Model, возвращает boolean
   */
  rowDisable?: TRowDisable;

  /**
   * Ключи доступа к данным
   */
  dataAccessKeys?: string[];
}

export interface IAutoFillFieldProps
  extends Omit<IFieldProps<TAutoFillFieldValue>, "children">,
    IAutoFillOwnProps {
  name: string;
}

export interface IAutoFillFormFieldProps
  extends IFormFieldProps<TAutoFillFieldValue>,
    IAutoFillOwnProps {}

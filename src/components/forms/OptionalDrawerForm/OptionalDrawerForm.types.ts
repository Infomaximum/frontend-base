import type { IDrawerFormOwnProps } from "../DrawerForm/DrawerForm.types";

export interface IOptionConfig {
  value: string;
  label?: string;
  disabled?: boolean;
}

export interface IContentConfig {
  inlineContent?: JSX.Element;
  mainContent?: JSX.Element;
  /**
   * Ключи опций, при выборе которых отрисовывается контент.
   */
  matchOptions?: string[];
}

export interface IOptionalDrawerFormProps extends Omit<IDrawerFormOwnProps, "onSubmit"> {
  /**
   * Список опций, отображаемых в селекте дровера.
   */
  optionsConfig?: IOptionConfig[];
  /**
   * Значение опции, которая отображается в селекте по-умолчанию.
   */
  defaultOption?: string;
  contents?: IContentConfig[];
  /** Контент по-умолчанию, если нет совпадений среди contents */
  defaultContent?: Omit<IContentConfig, "matchOptions">;
  onSubmit(formValues: TDictionary, option: string): Promise<void>;

  /** дисейблить submit button если в дровере не выбрали элементы */
  disableSubmitFormButtonOnEmpty?: boolean;
}

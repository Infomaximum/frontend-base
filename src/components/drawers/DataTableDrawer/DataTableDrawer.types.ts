import type React from "react";
import type { ButtonProps } from "antd/lib/button/button";
import type { DrawerProps } from "antd/lib/drawer";
import type { IDataTableDrawerContentProps } from "./DataTableDrawerContent/DataTableDrawerContent.types";
import type { IOptionalDrawerFormProps } from "../../forms/OptionalDrawerForm/OptionalDrawerForm.types";
import type { IModel } from "@im/models";
import type { IColumnProps } from "../../VirtualizedTable/VirtualizedTable.types";

export interface IDataTableDrawerOwnProps<
  T extends IConvertedModel = IConvertedModel
> extends DrawerProps,
    Omit<IDataTableDrawerContentProps<T>, "columns">,
    Pick<
      IOptionalDrawerFormProps,
      | "optionsConfig"
      | "defaultOption"
      | "defaultContent"
      | "contents"
      | "setFormData"
    > {
  selectedModels?: IModel[];
  onSaveData(
    selectedModels: IModel[],
    formValues: TDictionary,
    option: string
  ): Promise<any> | undefined;
  onClose(): void;
  initialValues?: TDictionary;
  okText: string;
  cancelText: string;
  drawerWidth?: string | number;
  columnConfig?: IColumnProps<T>[];
  notification?:
    | React.ReactNode
    | (() => React.ReactNode)
    | [
        (
          formValues?: TDictionary,
          props?: any
        ) => React.ReactNode | React.ReactNode[]
      ];
  /**
   * Запрещать ли submit при пустой форме
   */
  disableSubmitFormButtonOnEmpty?: boolean;
  isHasAccess?: boolean;
  isVirtualized?: boolean;
  /**
   * Данный пропс определяет будет ли заблокирована кнопка submit button.
   * Если передать true - то кнопка будет всегда заблокирована.
   * Если передать false - то кнопка не будет заблокирована.
   * Если этот пропс не использовать (или передать undefined), то блокирование  кнопки будет определяться по другим условиям
   */
  disableSubmitFormButton?: boolean;
}

export interface IDataTableDrawerProps<
  T extends IConvertedModel = IConvertedModel
> extends IDataTableDrawerOwnProps<T> {
  treeCheckedStateCleanSetter?: (treeCheckedStateCleaner: () => void) => void;
}

export interface IOkButtonProps extends Omit<ButtonProps, "icon"> {}

export interface IConvertedModel {
  id?: number;
  key: string;
  name?: string;
  model: IModel;
}

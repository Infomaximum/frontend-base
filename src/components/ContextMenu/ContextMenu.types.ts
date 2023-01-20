import type { IDropdownProps } from "@im/base/src/components/Dropdown/Dropdown.types";
import type { EOperationType } from "@im/utils";
import type { Interpolation } from "@emotion/react";
import type { SubMenuProps } from "antd/lib/menu/SubMenu";

export enum ESortingMethodsNames {
  priority = "priority",
  title = "title",
}

export type TContextMenuParamItem = IContextMenuParam | IContextMenuDivider | IContextSubMenuParam;

export interface IContextMenuParam {
  key?: string;
  /** Наименование элемента контекстного меню */
  title: string | React.ReactNode;
  /** Функция, которая выполнится при клике на элементе контекстного меню */
  clickHandler(): void;
  disabled?: boolean;
  /** Действие, которое выполняется по клику на этот пункт контекстного меню. */
  action?: string;

  /**
   * Список ключей привилегий и операций, наличие которых у пользователя необходимо для отображения пунктов контекстного
   * меню. В качестве ключа объекта передаётся ключ привилегии, а значение - список из необходимых операций по данной
   * привилегии. Для отображения пункта меню необходимо наличие у пользователя доступа к операциям по всем привилегиям,
   * указанным в этом списке. Если, после фильтрации пунктов контекстного меню не осталось ни одного пункта, то
   * контекстное меню не будет отображаться вовсе.
   */
  accessRules?: { [key: string]: EOperationType[] };
  "test-id"?: string;
  priority?: number;
}
export interface IContextMenuDivider
  extends Partial<Pick<IContextMenuParam, "priority" | "title">> {
  type: "divider";
}

export interface IContextSubMenuParam
  extends Omit<SubMenuProps, "title" | "children" | "disabled">,
    Omit<IContextMenuParam, "clickHandler" | "action"> {
  children: TContextMenuParamItem[];
}

export interface IContextMenuProps extends Omit<IDropdownProps, "overlay" | "overlayStyle"> {
  content: TContextMenuParamItem[];
  "test-id"?: string;
  buttonStyle?: Interpolation<TTheme>;
  withoutChildWrapper?: boolean;
  dropdownStyle?: React.CSSProperties;

  /** Определяет метод сортировки пунктов контекстного меню. */
  sortBy?: keyof typeof ESortingMethodsNames;
}

export type TSortingMethodsList = {
  [key in keyof typeof ESortingMethodsNames]: (
    arr: TContextMenuParamItem[]
  ) => TContextMenuParamItem[];
};

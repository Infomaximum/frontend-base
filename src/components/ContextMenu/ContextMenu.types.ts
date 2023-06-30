import type { IDropdownProps } from "../../components/Dropdown/Dropdown.types";
import type { EOperationType } from "@infomaximum/utility";
import type { Interpolation } from "@emotion/react";
import type { SubMenuProps } from "antd/lib/menu/SubMenu";
import type { MenuProps } from "antd";

export enum ESortingMethodsNames {
  priority = "priority",
  title = "title",
}

export type TContextMenuParamItem = IContextMenuParam | IContextMenuDivider | IContextSubMenuParam;

export type TOnItemClickParam = {
  param: Parameters<NonNullable<MenuProps["onClick"]>>[0];
  item: IContextMenuParam;
};

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
  onItemClick?: (params: TOnItemClickParam) => void;

  /** Определяет метод сортировки пунктов контекстного меню. */
  sortBy?: keyof typeof ESortingMethodsNames;
  /** Отображать ли внутренний контент вместо null, если элементов контекстного меню нет ([]) */
  renderChildIfItemsEmpty?: boolean;
}

export type TSortingMethodsList = {
  [key in keyof typeof ESortingMethodsNames]: (
    arr: TContextMenuParamItem[]
  ) => TContextMenuParamItem[];
};

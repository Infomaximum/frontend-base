import type { DropdownProps as AntDropdownProps } from "antd";

export interface IDropdownProps
  extends Omit<AntDropdownProps, "destroyPopupOnHide">,
    Partial<IDropdownParams> {}

export interface IDropdownParams {
  /** Высота элемента Dropdown (подразумевается, что все элементы равны по высоте) */
  itemHeight: number;
  /** Максимально количество одновременно видимых элементов Dropdown */
  visibleMaxCount: number;
  /** Внутренний вертикальный отступ Dropdown (одинаковый сверху и снизу) */
  padding: number;
  /** Отступ между Dropdown и целевым элементом */
  targetGap: number;
}

/** Количество свободного пространства над и под целевым элементом */
export interface IFreeSpace {
  /** Расстояние от верхней части до верхнего края popupContainer */
  top: number;
  /** Расстояние от нижней части до нижнего края popupContainer */
  bottom: number;
}

export type TXPlacement = "left" | "center" | "right";

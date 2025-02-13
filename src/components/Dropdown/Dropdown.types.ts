import type { DropdownProps as AntDropdownProps } from "antd";

export interface IDropdownProps
  extends Omit<AntDropdownProps, "destroyPopupOnHide" | "overlay">,
    Partial<IDropdownParams> {}

export interface IDropdownSizeParams {
  /** Высота элемента Dropdown (подразумевается, что все элементы равны по высоте) */
  itemHeight?: number;
  /** Максимально количество одновременно видимых элементов Dropdown */
  visibleMaxCount?: number;
  /** Внутренний вертикальный отступ Dropdown (одинаковый сверху и снизу) */
  padding?: number;
}

export interface IDropdownParams extends IDropdownSizeParams {
  /** Отступ между Dropdown и целевым элементом */
  targetGap?: number;
}

/** Количество свободного пространства над и под целевым элементом */
export interface IFreeSpace {
  /** Расстояние от верхней части до верхнего края popupContainer */
  top: number;
  /** Расстояние от нижней части до нижнего края popupContainer */
  bottom: number;
}

export type TXPlacement = "left" | "center" | "right";

export type TDropdownPositionResult = {
  height: number | undefined;
  align: AntDropdownProps["align"];
  compute: (getPopupContainer?: (t: HTMLElement) => HTMLElement) => void;
};

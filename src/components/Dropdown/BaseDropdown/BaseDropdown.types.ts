import type { Interpolation } from "@emotion/react";
import type React from "react";
import type { IDropdownParams } from "../Dropdown.types";
import type { EBaseDropdownPlacement } from "./BaseDropdown";

export interface IBaseDropdownProps extends Partial<IDropdownParams> {
  button: JSX.Element;
  placement?: EBaseDropdownPlacement;
  /**
   * Предназначен для прокидывания состояния видимости наверх и выполнения каких либо действий
   */
  onVisibleChange?: (isShowMenu: boolean) => void;
  overlayStyle?: React.CSSProperties;
  menuStyle?: Interpolation<TTheme>;
  isManualHideMenu?: boolean;
  children: React.ReactNode;
}

export interface IBaseDropdownState {
  isShowMenu: boolean;
  isShowChildren: boolean;
}

export interface ICloneButtonDropdownProps {
  onClick?: (e: MouseEvent | React.MouseEvent<HTMLElement>) => void;
}

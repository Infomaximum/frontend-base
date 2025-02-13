import type { Interpolation } from "@emotion/react";
import type { RowProps } from "antd/lib/grid/row";
import type { TAccessRules } from "../../utils/access";
import type { topPanelModes } from "./TopPanel";

export type TTopPanelButtonObject = {
  component: React.ReactElement;
  accessRules?: TAccessRules | TAccessRules[];
  float?: "left" | "right";
  priority?: number;
  key?: string;
};

export interface ITopPanelProps {
  buttonObjects?: TTopPanelButtonObject[];
  onSelectedItemsClear?(): void;
  onInputChange?(text: string): void;
  mode: (typeof topPanelModes)[keyof typeof topPanelModes];
  searchValue?: string | null;
  allowClear?: boolean;
  customHeaderStyle?: Interpolation<TTheme>;
  customSelectedFiltersWrapperStyle?: Interpolation<TTheme>;
  buttonsRowStyle?: RowProps;
  searchPlaceholder?: string;
  isSearchDisabled?: boolean;
  searchBreakpoints?: Record<string, number>;
}

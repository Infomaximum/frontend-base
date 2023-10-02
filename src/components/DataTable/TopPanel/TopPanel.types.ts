import type { headerModes } from "../DataTableHeader/DataTableHeader";
import type { THeaderButtonObject } from "../DataTable.types";
import type { Interpolation } from "@emotion/react";
import type { RowProps } from "antd/lib/grid/row";
import type { TreeCounter } from "../../../managers/TreeCounter";

export interface ITopPanelProps {
  selectedItemsCount: number;
  headerButtonsObjects?: THeaderButtonObject[];
  onSelectedItemsClear(): void;
  onInputChange?(text: string): void;
  headerMode: Omit<
    (typeof headerModes)[keyof typeof headerModes],
    (typeof headerModes)["SIMPLE_INPUT"]
  >;
  searchValue?: string | null;
  allowClear?: boolean;
  customHeaderStyle?: Interpolation<TTheme>;
  buttonsRowStyle?: RowProps;
  searchPlaceholder?: string;
  isExpandedTopPanel?: boolean;
}

export interface ITableTopButtonDisabledProps {
  treeCounter: TreeCounter | null;

  /**
   * Активация при пустом выборе
   */
  empty?: boolean;

  /**
   * Активация при выборе только одной группы
   */
  singleGroup?: boolean;

  /**
   * Активация при выборе только одной группы, без учёта количества вложенных групп
   */
  shallowSingleGroup?: boolean;

  /**
   * Активация при выборе одной или нескольких групп
   */
  onlyGroup?: boolean;

  /**
   * Активация при выборе одной не группы
   */
  singleItem?: boolean;

  /**
   * Активация при выборе одной или нескольких не групп
   */
  onlyItem?: boolean;

  /**
   * Активация при выборе одного элемента любого типа
   */
  singleAnything?: boolean;

  /**
   * Активация при выборе одного элемента любого типа, без учёта количества вложенных групп
   */
  shallowSingleAnything?: boolean;

  /**
   * Активация при выборе одного или нескольких элементов любого типа
   */
  anything?: boolean;

  /**
   * Активация при выборе всех элементов
   */
  full?: boolean;
}

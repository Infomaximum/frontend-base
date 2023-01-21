import type { IDropdownPendingPlaceholderProps } from "../DropdownPendingPlaceholder/DropdownPendingPlaceholder.types";

export interface IDropdownPlaceholderProps
  extends Omit<IDropdownPendingPlaceholderProps, "isDataLoaded" | "loading"> {}

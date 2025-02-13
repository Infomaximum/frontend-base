export interface IFilterListProps {
  children: JSX.Element[];
  removeFilterIndex: number | undefined;
}

export interface IFilterListState {
  widthWrapper: number;
  maxCountFilterSmall: number;
  maxCountFilterLarge: number;
  showAnimationAdd: boolean;
  showAnimationRemove: boolean;
}

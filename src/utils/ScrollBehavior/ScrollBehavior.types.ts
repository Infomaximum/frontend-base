export interface IScrollBehavior {
  hideScroll(): void;
  showScroll(): void;
}

export type TScrollBehaviorOptions = {
  isRelativelyWindow: boolean;
};

export interface IScrollBehavior {
  hideScroll(): void;
  showScroll(): void;
}

export type TScrollBehaviorOptions = {
  isRelativelyWindow: boolean;
  nestedScrollContainerId?: string;
  scrollSpaceParams?: {
    scrollWidth: number;
    rightPaddingWidth: number;
  };
};

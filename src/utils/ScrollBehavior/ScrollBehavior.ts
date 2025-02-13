import { MAIN_LAYOUT_SCROLL_CONTAINER_ID, MAIN_LAYOUT_CONTENT_ID } from "../const";
import type { IScrollBehavior, TScrollBehaviorOptions } from "./ScrollBehavior.types";

export class ScrollBehavior implements IScrollBehavior {
  private _scrollWidth!: number;
  private bodyOverflowValue!: string;
  private scrollContainer!: HTMLElement | null;
  private isRelativelyWindow: boolean;
  private nestedContainerId?: string;
  private fixedScrollSpaceParams?: {
    scrollWidth: number;
    rightPaddingWidth: number;
  };
  constructor(
    private wrapperContainerId: string,
    options: TScrollBehaviorOptions
  ) {
    this.isRelativelyWindow = options.isRelativelyWindow;
    this.nestedContainerId = options.nestedScrollContainerId;
    this.fixedScrollSpaceParams = options.scrollSpaceParams;
  }

  public get scrollWidth() {
    if (this.isNestedContainer && !!this.fixedScrollSpaceParams) {
      return this.fixedScrollSpaceParams?.scrollWidth;
    }

    this.calculateScrollWidth();

    return this._scrollWidth;
  }

  private getScrollContainer() {
    this.scrollContainer =
      document.getElementById(this.nestedContainerId ?? this.wrapperContainerId) ??
      document.getElementById(this.wrapperContainerId);

    return this.scrollContainer;
  }

  private get isNestedContainer() {
    return this.scrollContainer?.id === this.nestedContainerId;
  }

  private setStyles(scrollOverflowY: string, paddingRight: number, overflowBody: string) {
    const scrollContainer = this.getScrollContainer();

    if (!scrollContainer) {
      return;
    }

    scrollContainer.style.overflowY = scrollOverflowY;
    scrollContainer.style.paddingRight = `${paddingRight}px`;
    document.body.style.overflow = overflowBody;
  }

  private calculateScrollWidth() {
    const scrollContainer = this.getScrollContainer();

    if (!scrollContainer) {
      return;
    }

    if (this.isRelativelyWindow) {
      this._scrollWidth = window.innerWidth - scrollContainer.clientWidth;
    } else {
      this._scrollWidth = scrollContainer.offsetWidth - scrollContainer.clientWidth;
    }
  }

  public hideScroll() {
    this.bodyOverflowValue = document.body.style.overflow;
    this.calculateScrollWidth();

    this.setStyles(
      "hidden",
      this.isNestedContainer && !!this.fixedScrollSpaceParams
        ? this.fixedScrollSpaceParams.rightPaddingWidth
        : this.scrollWidth,
      "hidden"
    );
  }

  public showScroll() {
    this.calculateScrollWidth();

    if (this.isNestedContainer && !!this.fixedScrollSpaceParams) {
      this.setStyles(
        "scroll",
        this.fixedScrollSpaceParams.rightPaddingWidth - this.scrollWidth,
        this.bodyOverflowValue
      );
    } else {
      this.setStyles("auto", 0, this.bodyOverflowValue);
    }
  }
}

export const globalScrollBehavior = new ScrollBehavior(MAIN_LAYOUT_CONTENT_ID, {
  isRelativelyWindow: true,
  nestedScrollContainerId: MAIN_LAYOUT_SCROLL_CONTAINER_ID,
  scrollSpaceParams: {
    rightPaddingWidth: 16,
    scrollWidth: 10,
  },
});

import { MAIN_LAYOUT_CONTENT_ID } from "../const";
import type {
  IScrollBehavior,
  TScrollBehaviorOptions,
} from "./ScrollBehavior.types";

export class ScrollBehavior implements IScrollBehavior {
  private _scrollWidth!: number;
  private bodyOverflowValue!: string;
  private scrollContainer!: HTMLElement | null;
  private isRelativelyWindow: boolean;

  constructor(
    private scrollContainerId: string,
    options: TScrollBehaviorOptions
  ) {
    this.isRelativelyWindow = options.isRelativelyWindow;
  }

  public get scrollWidth() {
    this.calculateScrollWidth();
    return this._scrollWidth;
  }

  private getScrollContainer() {
    this.scrollContainer = document.getElementById(this.scrollContainerId);

    return this.scrollContainer;
  }

  private setStyles(
    scrollOverflowY: string,
    paddingRight: number,
    overflowBody: string
  ) {
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
      this._scrollWidth =
        scrollContainer.offsetWidth - scrollContainer.clientWidth;
    }
  }

  public hideScroll() {
    this.bodyOverflowValue = document.body.style.overflow;
    this.calculateScrollWidth();
    this.setStyles("hidden", this.scrollWidth, "hidden");
  }

  public showScroll() {
    this.calculateScrollWidth();
    this.setStyles("auto", 0, this.bodyOverflowValue);
  }
}

export const globalScrollBehavior = new ScrollBehavior(MAIN_LAYOUT_CONTENT_ID, {
  isRelativelyWindow: true,
});

import { pick } from "lodash";
import type { ScrollParams } from "react-virtualized";

export class AntTableScrollListener {
  private bodyHtml: HTMLElement | null = null;

  constructor(
    container: HTMLElement,
    private onScroll: (params: ScrollParams) => void
  ) {
    this.bodyHtml = container.querySelector(".ant-table-body");
  }

  private onBodyScroll = (event: Event) => {
    if (event.target instanceof HTMLElement) {
      this.onScroll(
        pick(event.target, [
          "clientHeight",
          "clientWidth",
          "scrollHeight",
          "scrollLeft",
          "scrollTop",
          "scrollWidth",
        ])
      );
    }
  };

  public listen() {
    this.bodyHtml?.addEventListener("scroll", this.onBodyScroll);
  }

  public dispose() {
    this.bodyHtml?.removeEventListener("scroll", this.onBodyScroll);
  }
}

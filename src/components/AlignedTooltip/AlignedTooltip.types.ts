import type { Interpolation } from "@emotion/react";
import type { TooltipPropsWithTitle } from "antd/lib/tooltip";
import type { RefObject } from "react";

export interface IAlignedTooltipProps {
  title?: TooltipPropsWithTitle["title"];
  children: React.ReactNode;
  offsetY?: number;
  className?: string;
  numberOfLines?: number;
  customStyle?: Interpolation<TTheme>;
  /** расширять на 100% родительского элемента или нет (width/maxWidth) default: true */
  expandByParent?: boolean;
  visible?: boolean;
  removeMouseEnterDelay?: boolean;
  /* возможность переопределить контейнер, относительно которого происходят расчеты */
  containerRef?: RefObject<HTMLDivElement>;
}

import { useRef, type FC } from "react";
import { useOverflow } from "../../decorators";
import { Tooltip } from "../Tooltip";
import type { IAutoTooltipProps } from "./AutoTooltip.types";

export const AutoTooltip: FC<IAutoTooltipProps> = ({ title, children, className }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { isOverflow } = useOverflow(wrapperRef, children);
  const childrenTitle = wrapperRef?.current?.innerText;

  return (
    <div ref={wrapperRef}>
      <Tooltip title={title ?? (isOverflow && childrenTitle)} className={className}>
        {children}
      </Tooltip>
    </div>
  );
};

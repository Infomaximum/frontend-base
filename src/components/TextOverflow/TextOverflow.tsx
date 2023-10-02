import { type FC, memo, useRef } from "react";
import type { ITextOverflowProps } from "./TextOverflow.types";
import { textOverflowStyle, textOverflowOverlayStyle } from "./TextOverflow.styles";
import { useTheme, useOverflow } from "../../decorators";
import { AutoTooltip } from "../AutoTooltip";

const TextOverflowComponent: FC<ITextOverflowProps> = ({
  children,
  customStyle,
  isRelative = true,
  isDark = false,
  title,
  className,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { isOverflow } = useOverflow(ref, children);
  const theme = useTheme();

  const overlayColor = isDark ? theme.grey13Color : theme.grey1Color;

  return (
    <div
      ref={ref}
      css={[textOverflowStyle, customStyle]}
      style={{
        position: isRelative ? "relative" : "static",
        mixBlendMode: isDark ? "screen" : "multiply",
      }}
    >
      <AutoTooltip title={title} className={className}>
        {children}
      </AutoTooltip>
      {isOverflow && <div css={textOverflowOverlayStyle(overlayColor)} />}
    </div>
  );
};

export const TextOverflow = memo(TextOverflowComponent);

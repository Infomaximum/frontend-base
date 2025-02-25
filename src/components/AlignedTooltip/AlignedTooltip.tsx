import {
  useCallback,
  useRef,
  useState,
  type FC,
  type MouseEvent as ReactMouseEvent,
  type WheelEvent,
} from "react";
import { useUnmountEffect } from "../../decorators";
import type { IAlignedTooltipProps } from "./AlignedTooltip.types";
import {
  getAlignedTooltipStyle,
  wrapperStyle,
  getExpandByParentStyle,
} from "./AlignedTooltip.styles";
import { AlignedTooltipComponent } from "./TooltipComponent/AlignedTooltipComponent";

const showTooltipDelay = 1500;
const hideTooltipDelay = 150;

export const AlignedTooltip: FC<IAlignedTooltipProps> = ({
  children,
  className,
  numberOfLines = 1,
  customStyle,
  expandByParent = true,
  visible,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const clientXRef = useRef(0);
  const [isNeedTooltip, setIsNeedTooltip] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  const handleClearTimer = useCallback(() => {
    timerRef.current && clearTimeout(timerRef.current);
  }, []);

  useUnmountEffect(() => {
    handleClearTimer();
  });

  const updateOffsetX = useCallback((e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    clientXRef.current = e.clientX;
  }, []);

  const handleMouseOver = useCallback(
    (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
      updateOffsetX(e);

      handleClearTimer();

      timerRef.current = setTimeout(() => setIsNeedTooltip(true), showTooltipDelay);
    },
    [handleClearTimer, updateOffsetX]
  );

  const handleMouseOut = useCallback(
    (e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
      updateOffsetX(e);

      handleClearTimer();

      timerRef.current = setTimeout(() => setIsNeedTooltip(false), hideTooltipDelay);
    },
    [handleClearTimer, updateOffsetX]
  );

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (visible === false || !isNeedTooltip) {
        return;
      }

      // Скрываем тултип при горизонтальном скролле контейнера (Shift + колесо мыши)
      if (e.shiftKey) {
        isNeedTooltip && setIsNeedTooltip(false);
      }
    },
    [visible, isNeedTooltip]
  );

  return (
    <div
      css={[wrapperStyle, getExpandByParentStyle(expandByParent), customStyle]}
      className={className}
    >
      <div
        css={[getAlignedTooltipStyle(numberOfLines), getExpandByParentStyle(expandByParent)]}
        ref={containerRef}
        onMouseMove={updateOffsetX}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onWheel={handleWheel}
      >
        {visible !== false && isNeedTooltip && (
          <AlignedTooltipComponent
            offsetX={clientXRef.current}
            containerRef={containerRef}
            visible={true}
            {...rest}
          />
        )}
        {children}
      </div>
    </div>
  );
};

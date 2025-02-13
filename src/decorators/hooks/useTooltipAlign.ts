import { debounce } from "lodash";
import {
  useCallback,
  useState,
  type RefObject,
  type MouseEvent as ReactMouseEvent,
  type WheelEvent,
  useMemo,
  useRef,
} from "react";

interface IUseTooltipAlignProps {
  containerRef: RefObject<HTMLDivElement>; // ref контейнера на котором нужно отобразить тултип.
  wrapper?: HTMLDivElement | null; // Контейнер, использующийся для предотвращения морганий тултипа.
  arrowOffset?: number; // Значение стандартного отступа стрелки тултипа.
  isChangeDirectionCalculationNeeded?: boolean; // Нужно ли менять направление тултипа в зависимости от того, выходит он за пределы или нет.
  textWidth?: number; // Значение ширины текста тултипа в пикселях.
  offsetY?: number; // Значение отступа тултипа по оси Y.
}

const showTooltipDelay = 1500;
const standardArrowOffset = 21;

export const useTooltipAlign = (tooltipParams: IUseTooltipAlignProps) => {
  const {
    containerRef,
    wrapper,
    arrowOffset = standardArrowOffset,
    isChangeDirectionCalculationNeeded = false,
    textWidth = 520,
    offsetY = -4,
  } = tooltipParams;

  const [tooltipAlign, setTooltipAlign] = useState({ offset: [0, offsetY] });
  const [isHideTooltip, setIsHideTooltip] = useState(false);
  const clientXRef = useRef(0);

  const [isChangeHorizontalDirection, setIsChangeHorizontalDirection] = useState<boolean>(true);

  const debouncedShowTooltip = useMemo(
    () =>
      debounce(() => {
        setIsHideTooltip(false);
      }, showTooltipDelay),
    []
  );

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!containerRef.current || !wrapper) {
        return;
      }

      // Скрываем тултип при горизонтальном скролле контейнера (Shift + колесо мыши)
      if (e.shiftKey) {
        setIsHideTooltip(true);

        return;
      }

      const { scrollTop, scrollHeight, clientHeight } = wrapper;

      // Предотвращаем моргание тултипа, если контейнер полностью прокручен вверх или вниз
      if (scrollTop === 0 || scrollTop + clientHeight === scrollHeight) {
        return;
      }

      debouncedShowTooltip();
      setIsHideTooltip(true);
    },
    [containerRef, wrapper, debouncedShowTooltip]
  );

  const handleMouseLeave = useCallback(() => setIsHideTooltip(false), []);

  const updateOffsetX = useCallback((e: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
    clientXRef.current = e.clientX;
  }, []);

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        return;
      }

      if (!containerRef.current) {
        return;
      }

      const { left: containerLeft, right: containerRight } =
        containerRef.current?.getBoundingClientRect();

      let offsetX: number;

      const isEnoughSpace = document.body.clientWidth - clientXRef.current > textWidth;
      setIsChangeHorizontalDirection(!isEnoughSpace);

      if (isEnoughSpace) {
        offsetX = clientXRef.current - containerLeft - arrowOffset;
      } else {
        if (isChangeDirectionCalculationNeeded) {
          const isEnoughSpaceOnLeft =
            document.body.clientWidth - (document.body.clientWidth - clientXRef.current) >
            textWidth;

          if (isEnoughSpaceOnLeft) {
            offsetX = clientXRef.current - containerRight + arrowOffset;
          } else {
            // Ситуация, когда ни слева, ни справа не хватает места.
            setIsChangeHorizontalDirection(false);
            offsetX = 0;
          }
        } else {
          offsetX = clientXRef.current - containerLeft - arrowOffset;
        }
      }

      setTooltipAlign({ offset: [offsetX, offsetY] });
    },
    [containerRef, textWidth, offsetY, arrowOffset, isChangeDirectionCalculationNeeded]
  );

  return {
    tooltipAlign,
    isHideTooltip,
    isChangeHorizontalDirection,
    updateOffsetX,
    handleOpenChange,
    handleWheel,
    handleMouseLeave,
  };
};

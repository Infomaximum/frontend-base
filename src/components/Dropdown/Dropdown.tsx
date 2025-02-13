import { assertSimple } from "@infomaximum/assert";
// eslint-disable-next-line im/ban-import-entity
import { Dropdown as AntDropdown } from "antd";
import { noop } from "lodash";
import React, { isValidElement, useCallback, useRef, useMemo, useEffect } from "react";
import type { IDropdownProps } from "./Dropdown.types";
import {
  defaultTrigger,
  extractXPlacement,
  injectRef,
  useDropdownPosition,
} from "./Dropdown.utils";

/**
 * Обертка, позволяющая дольше сохранять положение снизу за счет сжатия.
 * Игнорирует переданный вертикальный `placement`: компонент сам управляет вертикальным положением.
 */
const DropdownComponent: React.FC<IDropdownProps> = ({
  children: button,
  open,
  onOpenChange = noop,
  overlayStyle: propsOverlayStyle,
  trigger = defaultTrigger,
  getPopupContainer,
  itemHeight,
  visibleMaxCount,
  padding,
  targetGap = 4,
  align: propsAlign,
  placement = "bottomLeft",
  ...restProps
}) => {
  const buttonRef = useRef<HTMLElement>(null);

  const xPlacement = extractXPlacement(placement);
  const config = { itemHeight, visibleMaxCount, padding, targetGap } as const;
  const position = useDropdownPosition(buttonRef, config, xPlacement);

  // Не сжимаем Dropdown, если он отображается поверх контента
  const computePosition = trigger.includes("contextMenu") ? noop : position.compute;

  const handleOpenChange = useCallback(
    (open: boolean) => {
      open && computePosition(getPopupContainer);

      onOpenChange(open);
    },
    [onOpenChange, computePosition, getPopupContainer]
  );

  useEffect(() => {
    open && computePosition(getPopupContainer);
  }, [computePosition, getPopupContainer, open]);

  const maxHeight = position.height;
  const overlayStyle = useMemo(
    () =>
      ({
        ...propsOverlayStyle,
        maxHeight,
      }) as const,
    [propsOverlayStyle, maxHeight]
  );

  const align = useMemo(() => ({ ...position.align, ...propsAlign }), [propsAlign, position.align]);

  assertSimple(isValidElement(button), "Dropdown используется для невалидной кнопки");

  return (
    <AntDropdown
      {...restProps}
      align={align}
      open={open}
      getPopupContainer={getPopupContainer}
      onOpenChange={handleOpenChange}
      overlayStyle={overlayStyle}
      // Т.к. при скрытии вместо `display: none` продолжит применяться `flex`
      destroyPopupOnHide={true}
      trigger={trigger}
    >
      {injectRef(button, buttonRef)}
    </AntDropdown>
  );
};

export const Dropdown = DropdownComponent;

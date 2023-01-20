import { assertSimple } from "@im/utils";
// eslint-disable-next-line im/ban-import-entity
import { Dropdown as AntDropdown } from "antd";
import { noop } from "lodash";
import React, { isValidElement, useCallback, useRef, useMemo, memo, useEffect } from "react";
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
const Dropdown: React.FC<IDropdownProps> = ({
  children: button,
  overlay,
  visible,
  onVisibleChange = noop,
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

  const handleVisibleChange = useCallback(
    (isVisible: boolean) => {
      isVisible && computePosition(getPopupContainer);

      onVisibleChange(isVisible);
    },
    [onVisibleChange, computePosition, getPopupContainer]
  );

  useEffect(() => {
    visible && computePosition(getPopupContainer);
  }, [computePosition, getPopupContainer, visible]);

  const maxHeight = position.height;
  const overlayStyle = useMemo(
    () => ({ ...propsOverlayStyle, display: "flex", flexDirection: "column", maxHeight } as const),
    [propsOverlayStyle, maxHeight]
  );

  const align = useMemo(() => ({ ...position.align, ...propsAlign }), [propsAlign, position.align]);

  assertSimple(isValidElement(button), "Dropdown используется для невалидной кнопки");

  return (
    <AntDropdown
      {...restProps}
      align={align}
      visible={visible}
      getPopupContainer={getPopupContainer}
      overlay={overlay}
      onVisibleChange={handleVisibleChange}
      overlayStyle={overlayStyle}
      // Т.к. при скрытии вместо `display: none` продолжит применяться `flex`
      destroyPopupOnHide={true}
      trigger={trigger}
    >
      {injectRef(button, buttonRef)}
    </AntDropdown>
  );
};

export default memo(Dropdown);

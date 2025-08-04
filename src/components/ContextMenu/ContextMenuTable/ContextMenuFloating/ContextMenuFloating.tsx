import { type FC, useState, useMemo, useCallback, memo, useId, createContext, useRef } from "react";
import { getDropdownOverlayStyle } from "./ContextMenuFloating.styles";
import { isFunction, map } from "lodash";
import type { IContextMenuFloatingProps, TPositionCoordinates } from "./ContextMenuFloating.types";
import {
  getDropdownPositionCoordinates,
  getIsCursorInsideTextSelection,
  getSummaryDropdownHeight,
} from "./ContextMenuFloating.utils";
import React from "react";
import { useUnmountEffect } from "../../../../decorators";
import { getTextWidth } from "../../../../utils/textWidth";
import { ContextMenu } from "../../ContextMenu";
import {
  contextMenuItemSummaryHorizontalPadding,
  contextMenuItemSummaryVerticalPadding,
} from "../../ContextMenu.styles";
import type { IContextMenuItem, TContextMenuParamItem } from "../../ContextMenu.types";
import { tableContextMenuOverlayClassName } from "../ContextMenuTable";

// Значение border задаётся в global.styles.ts
const antDropdownBorderSummaryThickness = 2;
const antDropdownVerticalPadding = 4 * 2;
const antDropdownDividerHeight = 3;
const antDropdownElementHeight = 22;

export const FloatingMenuContext = createContext<
  ((closer: (open: boolean) => void) => void) | undefined
>(undefined);

export const ContextMenuFloating: FC<IContextMenuFloatingProps> = memo(
  ({ floatingContextMenuConfig, data, isRowChecked, children }) => {
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState<TPositionCoordinates>({ x: 0, y: 0 });
    const uniqueId = useId();
    const closeTableContextMenuRef = useRef<((open: boolean) => void) | undefined>(undefined);

    const customContextMenuId = useMemo(
      () =>
        `floating-context-menu-${(data?.key ?? data?.name ?? uniqueId).toString().replace(/[\#\.\:]/g, "_")}`,
      [data, uniqueId]
    );

    const getContextMenuContent = useCallback(
      ({
        label,
        title,
        type,
        action,
        disabled,
        accessRules,
        priority,
        ["test-id"]: testId,
        icon,
        clickHandler,
      }: IContextMenuItem) => {
        const paramItem: TContextMenuParamItem = {
          action,
          disabled,
          accessRules,
          priority,
          icon,
          title: label ?? title,
          "test-id": testId || action,
          clickHandler: clickHandler
            ? () => {
                setIsContextMenuOpen(false);
                clickHandler();
              }
            : () => {
                if (action && data) {
                  setIsContextMenuOpen(false);
                  floatingContextMenuConfig?.menuItemSelectHandler?.(action, data);
                }
              },
        };

        return { ...paramItem, ...(type && { type }) };
      },
      [data, floatingContextMenuConfig]
    );

    const contextMenuContent = useMemo(() => {
      if (!floatingContextMenuConfig || !data) {
        return null;
      }

      if (
        floatingContextMenuConfig.isMultipleRowSelected &&
        isRowChecked &&
        isFunction(floatingContextMenuConfig?.getMultipleRowMenuItems)
      ) {
        return map(floatingContextMenuConfig?.getMultipleRowMenuItems(data), getContextMenuContent);
      } else {
        return map(floatingContextMenuConfig?.getSingleRowMenuItems(data), getContextMenuContent);
      }
    }, [data, floatingContextMenuConfig, getContextMenuContent, isRowChecked]);

    const handleCloseDropdown = useCallback(
      (event: globalThis.Event) => {
        const closestElement = event.target as HTMLElement | null;

        if (!closestElement?.closest(`.${customContextMenuId}`)) {
          setIsContextMenuOpen(false);

          document.removeEventListener("wheel", handleCloseDropdown, { capture: true });
          document.removeEventListener("click", handleCloseDropdown, { capture: true });
          document.removeEventListener("contextmenu", handleCloseDropdown, { capture: true });
        }
      },
      [customContextMenuId]
    );

    const handleContextMenu = useCallback(
      (event: React.MouseEvent) => {
        closeTableContextMenuRef.current?.(false);
        event.stopPropagation();
        const eventTargetElement = event.target as HTMLElement;
        const isEventTargetElementLink = eventTargetElement.tagName.toLowerCase() === "a";
        const isEventTargetElementHasParentLink = eventTargetElement.closest("a");

        // Отображать стандартное меню, если клик ПКМ был по ссылке или по элементу самого меню
        if (
          isEventTargetElementLink ||
          isEventTargetElementHasParentLink ||
          eventTargetElement.closest(`.${tableContextMenuOverlayClassName}`)
        ) {
          return;
        }

        let selectionRect;
        const selection = window.getSelection && window.getSelection();

        if (selection && selection.rangeCount > 0) {
          selectionRect = window.getSelection()?.getRangeAt(0).getBoundingClientRect();
        }

        const cursorPosition = { x: event.clientX, y: event.clientY };

        if (selectionRect) {
          // Отображать стандартное меню, если клик был по выделенному тексту
          if (getIsCursorInsideTextSelection({ cursorPosition, selectionRect })) {
            return;
          }
        }

        event.preventDefault();

        const dropdownMenuItemTextWidths = map(contextMenuContent, (item) =>
          item.title ? getTextWidth(item.title.toString(), { size: 14 }) : 0
        );
        const dropdownMenuItemHeights = map(contextMenuContent, (item) =>
          item.type ? antDropdownDividerHeight : antDropdownElementHeight
        );

        const dropdownWidth =
          Math.max(...dropdownMenuItemTextWidths) +
          contextMenuItemSummaryHorizontalPadding +
          antDropdownBorderSummaryThickness;
        const dropdownHeight =
          getSummaryDropdownHeight(dropdownMenuItemHeights, contextMenuItemSummaryVerticalPadding) +
          antDropdownVerticalPadding +
          2;

        setIsContextMenuOpen(true);
        setDropdownPosition(
          getDropdownPositionCoordinates({
            cursorPosition,
            dropdownSizes: {
              dropdownWidth,
              dropdownHeight,
            },
          })
        );

        document.addEventListener("wheel", handleCloseDropdown, { capture: true });
        document.addEventListener("click", handleCloseDropdown, { capture: true });
        document.addEventListener("contextmenu", handleCloseDropdown, { capture: true });
      },
      [contextMenuContent, handleCloseDropdown]
    );

    useUnmountEffect(() => {
      document.removeEventListener("wheel", handleCloseDropdown, { capture: true });
      document.removeEventListener("click", handleCloseDropdown, { capture: true });
      document.removeEventListener("contextmenu", handleCloseDropdown, { capture: true });
    });

    const setCloser = useCallback((closer: (open: boolean) => void) => {
      closeTableContextMenuRef.current = closer;
    }, []);

    if (!contextMenuContent || contextMenuContent.length === 0) {
      return children;
    }

    return (
      <ContextMenu
        open={isContextMenuOpen}
        content={contextMenuContent}
        dropdownStyle={getDropdownOverlayStyle(dropdownPosition)}
        overlayClassName={customContextMenuId}
        withoutChildWrapper={true}
        isRenderChildIfItemsEmpty={true}
      >
        <FloatingMenuContext.Provider value={setCloser}>
          {React.isValidElement(children) &&
            React.cloneElement(children, {
              onContextMenu: handleContextMenu,
            })}
        </FloatingMenuContext.Provider>
      </ContextMenu>
    );
  }
);

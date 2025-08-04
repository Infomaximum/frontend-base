import React, { useCallback, useContext, useState } from "react";
import { first, map } from "lodash";
import type { IContextMenuTableProps } from "./ContextMenuTable.types";
import { contextMenuContainerStyle, getThreeDotsStyle } from "./ContextMenuTable.styles";
import { ContextMenu } from "../ContextMenu";
import type { IContextMenuItem } from "../ContextMenu.types";
import { FloatingMenuContext } from "./ContextMenuFloating/ContextMenuFloating";
import { useMountEffect } from "../../../decorators";

export const tableContextMenuOverlayClassName = "table-context-menu-overlay";

const ContextMenuTableComponent: React.FC<IContextMenuTableProps> = ({
  onSelect,
  data,
  items,
  isChecked,
}) => {
  const floatingContextMenuValue = useContext(FloatingMenuContext);
  const [isShowMenu, setIsShowMenu] = useState(false);

  const handleShowMenu = useCallback((open: boolean) => {
    setIsShowMenu(open);
  }, []);

  useMountEffect(() => {
    floatingContextMenuValue?.(handleShowMenu);
  });

  const content = map(
    items,
    ({
      label,
      action,
      disabled,
      accessRules,
      priority,
      ["test-id"]: testId,
      icon,
      clickHandler,
    }: IContextMenuItem) => ({
      action,
      disabled,
      accessRules,
      priority,
      icon,
      title: label,
      "test-id": testId || action,
      clickHandler:
        clickHandler ||
        (() => {
          if (action) {
            onSelect(action, data);
          }
        }),
    })
  );

  const firstItem = first(content);

  /** Если остается только один элемент в контекстном меню, и есть заданная иконка, то отображаем эту иконку */
  if (content.length === 1 && !!firstItem?.icon) {
    const { icon, clickHandler, action, priority, accessRules, ...rest } = firstItem;

    if (React.isValidElement(icon)) {
      return React.cloneElement(icon as JSX.Element, {
        ...rest,
        onClick: clickHandler,
      });
    } else {
      return null;
    }
  }

  return (
    <ContextMenu
      css={contextMenuContainerStyle}
      content={content}
      placement="bottomRight"
      buttonStyle={getThreeDotsStyle(isChecked)}
      overlayClassName={tableContextMenuOverlayClassName}
      onOpenChange={handleShowMenu}
      open={isShowMenu}
    />
  );
};

export const ContextMenuTable = React.memo(ContextMenuTableComponent);

import React from "react";
import { first, map } from "lodash";
import type { IContextMenuTableProps, TContextMenuItem } from "./ContextMenuTable.types";
import { threeDotsStyle } from "./ContextMenuTable.styles";
import { ContextMenu } from "../ContextMenu/ContextMenu";
import { useTheme } from "../../decorators/hooks/useTheme";

const ContextMenuTableComponent: React.FC<IContextMenuTableProps> = ({ onSelect, data, items }) => {
  const theme = useTheme();

  const content = map(
    items,
    ({ label, action, disabled, priority, ["test-id"]: testId, icon }: TContextMenuItem) => ({
      action,
      disabled,
      priority,
      icon,
      title: label,
      "test-id": testId || action,
      clickHandler() {
        onSelect(action, data);
      },
    })
  );

  const firstItem = first(content);

  /** Если остается только один элемент в контекстном меню, и есть заданная иконка, то отображаем эту иконку */
  if (content.length === 1 && !!firstItem?.icon) {
    const { icon, clickHandler, action, priority, ...rest } = firstItem;

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
    <ContextMenu content={content} placement="bottomRight" buttonStyle={threeDotsStyle(theme)} />
  );
};

export const ContextMenuTable = React.memo(ContextMenuTableComponent);

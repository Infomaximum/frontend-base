import React, { memo, useCallback, useMemo } from "react";
import { Dropdown } from "../Dropdown/Dropdown";
import type { MenuProps, SubMenuProps } from "antd/lib/menu";
import {
  wrapperContextMenuStyle,
  threeDotsButtonStyle,
  wrapperMenuDropdownStyle,
  getItemStyle,
} from "./ContextMenu.styles";
import {
  ESortingMethodsNames,
  type IContextMenuDivider,
  type IContextSubMenuParam,
  type TContextMenuParamItem,
  type IContextMenuProps,
  type TSortingMethodsList,
} from "./ContextMenu.types";
import { map, isEmpty, forEach, isFunction, last, dropRight } from "lodash";
import {
  contextMenuTestId,
  contextMenuItemTestId,
  contextMenuDropDownTestId,
  contextMenuDropDownBtnTestId,
} from "@infomaximum/base/src/utils/TestIds";
import { Button } from "../Button/Button";
import type { ItemType } from "antd/lib/menu/interface";
import { useFeature } from "@infomaximum/base/src/decorators/hooks/useFeature";
import { useTheme } from "@infomaximum/base/src/decorators/hooks/useTheme";
import { sortByPriority } from "@infomaximum/base/src/utils/Routes/routes";
import { isShowElement } from "@infomaximum/base/src/utils/access";
import { sortByTitle } from "@infomaximum/base/src/utils/sortings";
import { withTheme } from "@infomaximum/base/src/decorators/hocs/withTheme/withTheme";
import { removeDuplicateDividers } from "./ContextMenu.utils";
import { MoreOutlined } from "../Icons";

const dropdownTrigger: ["click"] = ["click"];

const sortingMethodsList: TSortingMethodsList = {
  [ESortingMethodsNames.priority]: sortByPriority,
  [ESortingMethodsNames.title]: sortByTitle,
};

const isDivider = (item: TContextMenuParamItem): item is IContextMenuDivider =>
  item.hasOwnProperty("type");

const isSubMenu = (item: TContextMenuParamItem): item is IContextSubMenuParam =>
  !isEmpty((item as IContextSubMenuParam).children);

const subMenuPopupOffset: SubMenuProps["popupOffset"] = [4, -5];

const ContextMenuComponent: React.FC<IContextMenuProps> = (props) => {
  const {
    placement,
    content: contentProp,
    trigger,
    dropdownStyle,
    buttonStyle,
    dividerStyle,
    withoutChildWrapper,
    subMenuCloseDelay = 0.3,
    triggerSubMenuAction = "click",
    sortBy = ESortingMethodsNames.priority,
    children,
    "test-id": testId,
    onItemClick,
    isRenderChildIfItemsEmpty = false,
    open,
    ...rest
  } = props;
  const { isFeatureEnabled } = useFeature();
  const theme = useTheme();

  const handleClickContextMenu = useCallback((e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
  }, []);

  const handleAuxClickContextMenu = useCallback((e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
  }, []);

  const theeDotsBtn = useMemo(() => {
    const threeDotsButtonStyles = [threeDotsButtonStyle(theme), buttonStyle];

    return (
      <Button
        key="context-menu_three-dots-btn"
        css={threeDotsButtonStyles}
        test-id={contextMenuDropDownBtnTestId}
      >
        <MoreOutlined />
      </Button>
    );
  }, [buttonStyle, theme]);

  const content = useMemo(() => {
    if (children) {
      return children;
    }

    return theeDotsBtn;
  }, [children, theeDotsBtn]);

  const dropDownContent = useMemo(() => {
    if (!withoutChildWrapper) {
      return (
        <div
          key="context-menu_dropdown-content"
          onClick={handleClickContextMenu}
          onAuxClick={handleAuxClickContextMenu}
          css={wrapperContextMenuStyle}
          className={rest?.className}
          test-id={testId ? testId : contextMenuTestId}
        >
          {content}
        </div>
      );
    } else {
      return content;
    }
  }, [
    content,
    handleAuxClickContextMenu,
    handleClickContextMenu,
    rest?.className,
    testId,
    withoutChildWrapper,
  ]);

  const filteredItems = useMemo(() => {
    const getFilteredItems = (items: TContextMenuParamItem[]) => {
      if (!items || !isFeatureEnabled) {
        return items ?? [];
      }

      const filteredItems: TContextMenuParamItem[] = [];

      forEach(items, (item) => {
        if (isDivider(item)) {
          filteredItems.push(item);
        } else if (!item.accessRules || isShowElement(item.accessRules, isFeatureEnabled)) {
          filteredItems.push(
            (item as IContextSubMenuParam).children
              ? {
                  ...item,
                  children: getFilteredItems((item as IContextSubMenuParam).children),
                }
              : item
          );
        }
      });

      return filteredItems;
    };

    const result = removeDuplicateDividers(
      getFilteredItems(sortingMethodsList[sortBy](contentProp))
    );

    const lastElement = last(result);

    return lastElement && !isDivider(lastElement) ? result : dropRight(result);
  }, [contentProp, isFeatureEnabled, sortBy]);

  const getMenuItems = useCallback(
    (content: TContextMenuParamItem[], prevLevelKey?: string): ItemType[] =>
      map(sortingMethodsList[sortBy](content), (item, index) => {
        const thisKey: string = `${prevLevelKey ?? ""}_${index}`;

        if (isDivider(item)) {
          return {
            key: thisKey,
            type: "divider",
            style: dividerStyle,
          };
        }

        const testId = item["test-id"]
          ? `${contextMenuItemTestId}_${item["test-id"]}`
          : contextMenuItemTestId;

        if (isSubMenu(item)) {
          const { accessRules, priority, children, ...rest } = item;

          return {
            key: thisKey,
            label: item.title,
            popupOffset: subMenuPopupOffset,
            "test-id": testId,
            ...rest,
            children: getMenuItems(children, thisKey),
          };
        }

        const style = getItemStyle(item.disabled);

        const wrappedClickFunction: MenuProps["onClick"] = (param) => {
          if (isFunction(onItemClick)) {
            onItemClick({ param, item });
          } else {
            param.domEvent.stopPropagation();
            item.clickHandler();
          }
        };

        return {
          key: thisKey,
          onClick: wrappedClickFunction,
          label: item.title,
          style: style(theme),
          disabled: item.disabled,
          "test-id": testId,
        };
      }),
    [dividerStyle, onItemClick, sortBy, theme]
  );

  const menuItems = useMemo(() => getMenuItems(filteredItems), [filteredItems, getMenuItems]);

  const menu = useMemo(() => {
    return {
      style: wrapperMenuDropdownStyle,
      "test-id": contextMenuDropDownTestId,
      items: menuItems,
      subMenuOpenDelay: 0,
      subMenuCloseDelay,
      triggerSubMenuAction,
    };
  }, [menuItems, subMenuCloseDelay, triggerSubMenuAction]);

  if (filteredItems.length === 0) {
    if (isRenderChildIfItemsEmpty) {
      return <>{dropDownContent}</>;
    }

    return null;
  }

  return (
    <Dropdown
      {...rest}
      menu={menu}
      trigger={trigger ? trigger : dropdownTrigger}
      placement={placement ? placement : "bottomRight"}
      overlayStyle={dropdownStyle}
      open={open}
    >
      {dropDownContent}
    </Dropdown>
  );
};

export const ContextMenu = memo(withTheme(ContextMenuComponent));

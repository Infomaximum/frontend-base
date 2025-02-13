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
} from "../../utils/TestIds";
import ThreeDotsSVG from "../../resources/icons/ThreeDots.svg";
import { Button } from "../Button/Button";
import type { ItemType } from "antd/lib/menu/interface";
import { useFeature } from "../../decorators/hooks/useFeature";
import { useTheme } from "../../decorators/hooks/useTheme";
import { sortByPriority } from "../../utils/Routes/routes";
import { isShowElement } from "../../utils/access";
import { sortByTitle } from "../../utils/sortings";
import { withTheme } from "../../decorators/hocs/withTheme/withTheme";
import { removeDuplicateDividers } from "./ContextMenu.utils";

const dropdownTrigger: ["click"] = ["click"];

const sortingMethodsList: TSortingMethodsList = {
  [ESortingMethodsNames.priority]: sortByPriority,
  [ESortingMethodsNames.title]: sortByTitle,
};

const isDivider = (item: TContextMenuParamItem): item is IContextMenuDivider =>
  item.hasOwnProperty("type");

const isSubMenu = (item: TContextMenuParamItem): item is IContextSubMenuParam =>
  !isEmpty((item as IContextSubMenuParam).children);

const subMenuPopupOffset: SubMenuProps["popupOffset"] = [0, -4];

const ContextMenuComponent: React.FC<IContextMenuProps> = (props) => {
  const {
    placement,
    content,
    trigger,
    dropdownStyle,
    buttonStyle,
    dividerStyle,
    withoutChildWrapper,
    sortBy = ESortingMethodsNames.priority,
    children,
    "test-id": testId,
    onItemClick,
    isRenderChildIfItemsEmpty = false,
    ...rest
  } = props;
  const { isFeatureEnabled } = useFeature();
  const theme = useTheme();

  const handleClickContextMenu = useCallback((e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
  }, []);

  const theeDotsBtn = useMemo(() => {
    const threeDotsButtonStyles = [threeDotsButtonStyle(theme), buttonStyle];

    if (children) {
      return children;
    } else {
      return (
        <Button
          key="context-menu_three-dots-btn"
          css={threeDotsButtonStyles}
          test-id={contextMenuDropDownBtnTestId}
        >
          <ThreeDotsSVG />
        </Button>
      );
    }
  }, [buttonStyle, children, theme]);

  const dropDownContent = useMemo(() => {
    if (!withoutChildWrapper) {
      return (
        <div
          key="context-menu_dropdown-content"
          onClick={handleClickContextMenu}
          css={wrapperContextMenuStyle}
          className={rest?.className}
          test-id={testId ? testId : contextMenuTestId}
        >
          {theeDotsBtn}
        </div>
      );
    } else {
      return theeDotsBtn;
    }
  }, [handleClickContextMenu, rest?.className, testId, theeDotsBtn, withoutChildWrapper]);

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

    const result = removeDuplicateDividers(getFilteredItems(sortingMethodsList[sortBy](content)));

    const lastElement = last(result);

    return lastElement && !isDivider(lastElement) ? result : dropRight(result);
  }, [content, isFeatureEnabled, sortBy]);

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
      subMenuCloseDelay: 0.3,
    };
  }, [menuItems]);

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
      placement={placement ? placement : "bottomLeft"}
      overlayStyle={dropdownStyle}
    >
      {dropDownContent}
    </Dropdown>
  );
};

export const ContextMenu = memo(withTheme(ContextMenuComponent));

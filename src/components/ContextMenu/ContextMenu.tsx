import React, { useCallback, useMemo } from "react";
import { Menu } from "antd";
import { Dropdown } from "../Dropdown/Dropdown";
import type { MenuProps, SubMenuProps } from "antd/lib/menu";
import { withFeature } from "../../decorators/hocs/withFeature/withFeature";
import {
  wrapperContextMenuStyle,
  threeDotsButtonStyle,
  wrapperMenuDropdownStyle,
  itemStyle,
} from "./ContextMenu.styles";
import {
  ESortingMethodsNames,
  IContextMenuDivider,
  IContextSubMenuParam,
  TContextMenuParamItem,
  IContextMenuProps,
  TSortingMethodsList,
} from "./ContextMenu.types";
import { map, isEmpty, forEach } from "lodash";
import {
  contextMenuTestId,
  contextMenuItemTestId,
  contextMenuDropDownTestId,
  contextMenuDropDownBtnTestId,
} from "../../utils/TestIds";
import ThreeDotsSVG from "../../resources/icons/ThreeDots.svg";
import { Button } from "../Button/Button";
import type { ItemType } from "antd/lib/menu/hooks/useItems";
import { useFeature } from "../../decorators/hooks/useFeature";
import { useTheme } from "../../decorators/hooks/useTheme";
import { sortByPriority } from "../../utils/Routes/routes";
import { isShowElement } from "../../utils/access";
import { sortByTitle } from "../../utils/sortings";
import { withTheme } from "../../decorators/hocs/withTheme/withTheme";

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
    withoutChildWrapper,
    sortBy = ESortingMethodsNames.priority,
    children,
    "test-id": testId,
    ...rest
  } = props;
  const { isFeatureEnabled } = useFeature();
  const theme = useTheme();

  const handleClickContextMenu = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      e.stopPropagation();
    },
    []
  );

  const theeDotsBtn = useMemo(() => {
    const threeDotsButtonStyles = [threeDotsButtonStyle, buttonStyle];

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
  }, [buttonStyle, children]);

  const dropDownContent = useMemo(() => {
    if (!withoutChildWrapper) {
      return (
        <div
          key="context-menu_dropdown-content"
          onClick={handleClickContextMenu}
          css={wrapperContextMenuStyle}
          test-id={testId ? testId : contextMenuTestId}
        >
          {theeDotsBtn}
        </div>
      );
    } else {
      return theeDotsBtn;
    }
  }, [handleClickContextMenu, testId, theeDotsBtn, withoutChildWrapper]);

  const filteredItems = useMemo(() => {
    const getFilteredItems = (items: TContextMenuParamItem[]) => {
      if (!items || !isFeatureEnabled) {
        return items ?? [];
      }

      const filteredItems: TContextMenuParamItem[] = [];

      forEach(items, (item) => {
        if (isDivider(item)) {
          filteredItems.push(item);
        } else if (
          !item.accessRules ||
          isShowElement(item.accessRules, isFeatureEnabled)
        ) {
          filteredItems.push(
            (item as IContextSubMenuParam).children
              ? {
                  ...item,
                  children: getFilteredItems(
                    (item as IContextSubMenuParam).children
                  ),
                }
              : item
          );
        }
      });

      return filteredItems;
    };

    return getFilteredItems(content);
  }, [content, isFeatureEnabled]);

  const getMenuItems = useCallback(
    (content: TContextMenuParamItem[], prevLevelKey?: string): ItemType[] =>
      map(sortingMethodsList[sortBy](content), (item, index) => {
        const thisKey: string = `${prevLevelKey ?? ""}_${index}`;

        if (isDivider(item)) {
          return {
            key: thisKey,
            type: "divider",
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

        const style = itemStyle(item.disabled, item.action);

        const wrappedClickFunction: MenuProps["onClick"] = (param) => {
          param.domEvent.stopPropagation();
          item.clickHandler();
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
    [sortBy, theme]
  );

  const menuItems = useMemo(
    () => getMenuItems(filteredItems),
    [filteredItems, getMenuItems]
  );

  const renderContextMenuItems = useCallback(() => {
    return (
      <Menu
        css={wrapperMenuDropdownStyle}
        test-id={contextMenuDropDownTestId}
        items={menuItems}
        subMenuOpenDelay={0}
        subMenuCloseDelay={0.3}
      />
    );
  }, [menuItems]);

  if (filteredItems.length === 0) {
    return null;
  }

  return (
    <Dropdown
      {...rest}
      overlay={renderContextMenuItems}
      trigger={trigger ? trigger : dropdownTrigger}
      placement={placement ? placement : "bottomLeft"}
      overlayStyle={dropdownStyle}
    >
      {dropDownContent}
    </Dropdown>
  );
};

export const ContextMenu = withFeature(withTheme(ContextMenuComponent));

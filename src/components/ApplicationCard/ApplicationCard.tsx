import { memo, useMemo, useCallback, forwardRef, type ForwardedRef, useState } from "react";
import type { IApplicationCardProps } from "./ApplicationCard.types";
import {
  titleStyle,
  contentStyle,
  contextMenuStyle,
  cardStyle,
  cardLeftPadding,
  getCardRightPadding,
  pointerCardStyle,
  focusStyle,
} from "./ApplicationCard.styles";
import { ContextMenu } from "../../components/ContextMenu/ContextMenu";
import { InlineTags } from "./InlineTags/InlineTags";
import { isEmpty, isFunction } from "lodash";
import { applicationCardTestId } from "../../utils/TestIds";
import { DELETE } from "../../utils/Localization/Localization";
import { useLocalization } from "../../decorators/hooks/useLocalization";
import { Link } from "react-router-dom";
import type { Interpolation } from "@emotion/react";
import { useTheme } from "../../decorators";
import type { TOnItemClickParam } from "../ContextMenu/ContextMenu.types";
import type { DropdownProps } from "antd/lib/dropdown";

const trigger: DropdownProps["trigger"] = ["contextMenu"];

const ApplicationCardComponent = forwardRef<
  HTMLAnchorElement | HTMLDivElement,
  IApplicationCardProps
>(
  (
    {
      entity,
      onClick,
      pathname,
      contextMenuGetter,
      measuredWidth,
      onRemove,
      isReadOnly,
      hasDeleteAccess,
    },
    ref
  ) => {
    const localization = useLocalization();
    const theme = useTheme();
    const [contextMenuInFocus, setContextMenuInFocus] = useState(false);
    const handleClick = useCallback(() => {
      if (isFunction(onClick)) {
        onClick(entity);
      }
    }, [onClick, entity]);

    const contextMenuItems = useMemo(() => {
      const menuItems = contextMenuGetter?.(entity) ?? [];

      if (!isReadOnly && hasDeleteAccess) {
        menuItems.push({
          title: localization.getLocalized(DELETE),
          action: "delete",
          clickHandler() {
            onRemove?.(entity);
          },
        });
      }

      return menuItems;
    }, [contextMenuGetter, entity, isReadOnly, hasDeleteAccess, localization, onRemove]);

    const hasContextMenu = !isEmpty(contextMenuItems);

    const cardStyles = useMemo(() => {
      const styles: Interpolation<TTheme> = [cardStyle(theme)];

      if (onClick || pathname) {
        styles.push(pointerCardStyle);
      }
      if (contextMenuInFocus) {
        styles.push(focusStyle(theme));
      }

      return styles;
    }, [contextMenuInFocus, onClick, pathname, theme]);

    const tagsMeasuredWidth =
      measuredWidth - (cardLeftPadding + getCardRightPadding(hasContextMenu));

    const cardWrapper = useMemo(() => {
      const content = (
        <div css={contentStyle}>
          <div css={titleStyle(theme)}>{entity.getName()}</div>
          <InlineTags tags={entity.tags} measuredWidth={tagsMeasuredWidth} />
        </div>
      );

      if (pathname) {
        return (
          <Link
            to={pathname}
            css={cardStyles}
            onClick={onClick && handleClick}
            ref={ref as ForwardedRef<HTMLAnchorElement>}
            test-id={`${applicationCardTestId}-${entity.contentTypename}-${entity.getId()}`}
          >
            {content}
          </Link>
        );
      } else {
        return (
          <div
            css={cardStyles}
            onClick={onClick && handleClick}
            ref={ref as ForwardedRef<HTMLDivElement>}
            test-id={`${applicationCardTestId}-${entity.contentTypename}-${entity.getId()}`}
          >
            {content}
          </div>
        );
      }
    }, [cardStyles, entity, handleClick, onClick, pathname, ref, tagsMeasuredWidth, theme]);

    const handleOpenChange = useCallback((isOpen: boolean) => {
      setContextMenuInFocus(isOpen);
    }, []);

    const onItemClick = useCallback(({ item, param }: TOnItemClickParam) => {
      setContextMenuInFocus(false);
      param.domEvent.stopPropagation();
      item.clickHandler();
    }, []);

    if (hasContextMenu) {
      return (
        <ContextMenu
          trigger={trigger}
          onOpenChange={handleOpenChange}
          content={contextMenuItems}
          onItemClick={onItemClick}
          css={contextMenuStyle}
        >
          {cardWrapper}
        </ContextMenu>
      );
    }

    return cardWrapper;
  }
);

export const ApplicationCard = memo(ApplicationCardComponent);

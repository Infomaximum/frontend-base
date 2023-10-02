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
import { useNavigate } from "react-router-dom";
import type { Interpolation } from "@emotion/react";
import { useTheme } from "../../decorators";
import type { TOnItemClickParam } from "../ContextMenu/ContextMenu.types";
import type { DropdownProps } from "antd/lib/dropdown";
import { useCardLinesOverlay } from "../../decorators/hooks/useCardLinesOverlay";

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
    const navigate = useNavigate();
    const theme = useTheme();
    const [contextMenuInFocus, setContextMenuInFocus] = useState(false);
    const { overlayedLines } = useCardLinesOverlay(entity.getName(), 18, 2, measuredWidth);

    const handleClick = useCallback(() => {
      if (pathname) {
        navigate(pathname);
      }

      if (isFunction(onClick)) {
        onClick(entity);
      }
    }, [pathname, onClick, navigate, entity]);

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
          <div css={titleStyle(theme)}>{overlayedLines}</div>
          <InlineTags tags={entity.tags} measuredWidth={tagsMeasuredWidth} />
        </div>
      );

      return (
        <div
          css={cardStyles}
          onClick={handleClick}
          ref={ref as ForwardedRef<HTMLDivElement>}
          test-id={`${applicationCardTestId}-${entity.contentTypename}-${entity.getId()}`}
        >
          {content}
        </div>
      );
    }, [cardStyles, entity, handleClick, overlayedLines, ref, tagsMeasuredWidth, theme]);

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

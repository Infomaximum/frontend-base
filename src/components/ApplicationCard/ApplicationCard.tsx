import { memo, useMemo, useCallback, forwardRef, type ForwardedRef, useState } from "react";
import type { IApplicationCardProps } from "./ApplicationCard.types";
import {
  titleStyle,
  contentStyle,
  contextMenuStyle,
  cardStyle,
  cardLeftPadding,
  getCardRightPadding,
  cardWithContextMenuStyle,
  pointerCardStyle,
  focusStyle,
} from "./ApplicationCard.styles";
import ContextMenu from "@im/base/src/components/ContextMenu/ContextMenu";
import InlineTags from "./InlineTags/InlineTags";
import { isEmpty, isFunction } from "lodash";
import { applicationCardTestId } from "@im/base/src/utils/TestIds";
import { DELETE } from "@im/base/src/utils/Localization/Localization";
import { useLocalization } from "@im/base/src/decorators/hooks/useLocalization";
import { Link } from "react-router-dom";
import type { Interpolation } from "@emotion/react";

const ApplicationCard = forwardRef<HTMLAnchorElement | HTMLDivElement, IApplicationCardProps>(
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

    const handleBlur = useCallback(() => {
      setContextMenuInFocus(false);
    }, []);

    const handleFocus = useCallback(() => {
      setContextMenuInFocus(true);
    }, []);

    const contextMenu = useMemo(() => {
      if (hasContextMenu) {
        return (
          <div css={contextMenuStyle} onBlur={handleBlur} onFocus={handleFocus}>
            <ContextMenu content={contextMenuItems} placement="bottomRight" />
          </div>
        );
      }
    }, [hasContextMenu, handleBlur, handleFocus, contextMenuItems]);

    const cardStyles = useMemo(() => {
      const styles: Interpolation<TTheme> = [cardStyle];

      if (onClick || pathname) {
        styles.push(pointerCardStyle);
      }

      if (hasContextMenu) {
        styles.push(cardWithContextMenuStyle);
      }

      if (contextMenuInFocus) {
        styles.push(focusStyle);
      }

      return styles;
    }, [contextMenuInFocus, hasContextMenu, onClick, pathname]);

    const tagsMeasuredWidth =
      measuredWidth - (cardLeftPadding + getCardRightPadding(hasContextMenu));

    const content = (
      <div css={contentStyle}>
        <div css={titleStyle}>{entity.getName()}</div>
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
          {contextMenu}
        </Link>
      );
    }

    return (
      <div
        css={cardStyles}
        onClick={onClick && handleClick}
        ref={ref as ForwardedRef<HTMLDivElement>}
        test-id={`${applicationCardTestId}-${entity.contentTypename}-${entity.getId()}`}
      >
        {content}
        {contextMenu}
      </div>
    );
  }
);

export default memo(ApplicationCard);

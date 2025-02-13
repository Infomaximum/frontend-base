import { useMemo, useCallback, forwardRef, type ForwardedRef, useState, useEffect } from "react";
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
import { observer } from "mobx-react";
import { AlignedTooltip } from "../AlignedTooltip";

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
      mainPageContentRef,
      isDeleteDisabled,
    },
    ref
  ) => {
    const localization = useLocalization();
    const navigate = useNavigate();
    const theme = useTheme();
    const [contextMenuInFocus, setContextMenuInFocus] = useState(false);
    const applicationName = entity.getName();

    const handleClick = useCallback(() => {
      if (!!document.getSelection()?.toString().trim()) {
        return;
      }

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
          disabled: isDeleteDisabled,
          action: "delete",
          clickHandler() {
            onRemove?.(entity);
          },
        });
      }

      return menuItems;
    }, [
      contextMenuGetter,
      entity,
      isReadOnly,
      hasDeleteAccess,
      localization,
      isDeleteDisabled,
      onRemove,
    ]);

    const hasContextMenu = !isEmpty(contextMenuItems);

    const cardStyles = useMemo(() => {
      const styles = [cardStyle(theme) as Interpolation<TTheme>];

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
          <div css={titleStyle(theme)}>
            <AlignedTooltip offsetY={-6} title={applicationName} numberOfLines={2}>
              {applicationName}
            </AlignedTooltip>
          </div>
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
    }, [theme, applicationName, entity, tagsMeasuredWidth, cardStyles, handleClick, ref]);

    const handleOpenChange = useCallback((isOpen: boolean) => {
      setContextMenuInFocus(isOpen);
    }, []);

    useEffect(() => {
      const mainPageContent = mainPageContentRef?.current;

      const scrollHandler = () => {
        setContextMenuInFocus(false);
        mainPageContent?.removeEventListener("scroll", scrollHandler);
      };

      if (contextMenuInFocus) {
        mainPageContent?.addEventListener("scroll", scrollHandler);
      } else {
        mainPageContent?.removeEventListener("scroll", scrollHandler);
      }
    }, [contextMenuInFocus, mainPageContentRef]);

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
          open={contextMenuInFocus}
        >
          {cardWrapper}
        </ContextMenu>
      );
    }

    return cardWrapper;
  }
);

export const ApplicationCard = observer(ApplicationCardComponent);

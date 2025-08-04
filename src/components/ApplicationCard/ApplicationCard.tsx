import {
  useMemo,
  useCallback,
  forwardRef,
  type ForwardedRef,
  useState,
  useEffect,
  useImperativeHandle,
} from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";
import { isEmpty, isFunction } from "lodash";
import type { Interpolation } from "@emotion/react";
import type { DropdownProps } from "antd/lib/dropdown";
import type { IApplicationCardProps } from "./ApplicationCard.types";
import {
  contentStyle,
  contextMenuStyle,
  pointerCardStyle,
  focusStyle,
  getTitleStyle,
  getCardStyle,
  disabledStyle,
} from "./ApplicationCard.styles";
import { ContextMenu } from "../../components/ContextMenu/ContextMenu";
import { applicationCardTestId } from "../../utils/TestIds";
import { DELETE } from "../../utils/Localization/Localization";
import { useLocalization } from "../../decorators/hooks/useLocalization";
import { useTheme } from "../../decorators";
import type { TOnItemClickParam } from "../ContextMenu/ContextMenu.types";
import { AlignedTooltip } from "../AlignedTooltip";

const trigger: DropdownProps["trigger"] = ["contextMenu"];

const ApplicationCardComponent = forwardRef<any, IApplicationCardProps>(
  (
    {
      entity,
      onClick,
      pathname,
      contextMenuGetter,
      onRemove,
      isReadOnly,
      hasDeleteAccess,
      mainPageContentRef,
      isDeleteDisabled,
      additionalFooter,
      subMenuCloseDelay,
      numberOfTitleLines = 2,
      isDisabled = false,
      contextMenuControllerRef,
    },
    ref
  ) => {
    const localization = useLocalization();
    const theme = useTheme();
    const [contextMenuInFocus, setContextMenuInFocus] = useState(false);

    const applicationName = entity.getName();

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
      const styles = [getCardStyle(numberOfTitleLines, theme) as Interpolation<TTheme>];

      if (onClick || pathname) {
        styles.push(pointerCardStyle);
      }

      if (contextMenuInFocus) {
        styles.push(focusStyle(theme));
      }

      if (isDisabled) {
        styles.push(disabledStyle(theme));
      }

      return styles;
    }, [contextMenuInFocus, onClick, pathname, theme, numberOfTitleLines, isDisabled]);

    const cardWrapper = useMemo(() => {
      const content = (
        <div css={contentStyle}>
          <div css={getTitleStyle(numberOfTitleLines, isDisabled)}>
            <AlignedTooltip offsetY={-6} title={applicationName} numberOfLines={numberOfTitleLines}>
              {applicationName}
            </AlignedTooltip>
          </div>
          {additionalFooter && additionalFooter}
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
      }

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
    }, [
      numberOfTitleLines,
      isDisabled,
      applicationName,
      additionalFooter,
      pathname,
      cardStyles,
      onClick,
      handleClick,
      ref,
      entity,
    ]);

    const handleOpenChange = useCallback((isOpen: boolean) => {
      setContextMenuInFocus(isOpen);
    }, []);

    useImperativeHandle(
      contextMenuControllerRef,
      () => ({
        closeContextMenu: () => handleOpenChange(false),
      }),
      [handleOpenChange]
    );

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
      item.clickHandler?.();
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
          subMenuCloseDelay={subMenuCloseDelay}
        >
          {cardWrapper}
        </ContextMenu>
      );
    }

    return cardWrapper;
  }
);

export const ApplicationCard = observer(ApplicationCardComponent);

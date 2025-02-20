import { compact, dropRight, last, size, takeRight } from "lodash";
import { useContainerWidth } from "../../decorators/hooks/useContainerWidth";
import { HomeOutlined } from "../Icons/Icons";
import {
  containerStyle,
  crumbStyle,
  homeIconStyle,
  lastCrumbTextStyle,
  getSeparatorStyle,
  labeledCrumbsContainerStyle,
  threeDotsIconStyle,
  getMenuStyle,
  dropdownWrapperStyle,
} from "./Breadcrumbs.styles";
import type { IBreadcrumbsProps } from "./Breadcrumbs.types";
import { calcShrinkMask, interleaveWith } from "./Breadcrumbs.utils";
import { Dropdown } from "../Dropdown/Dropdown";
import ThreeDotsSVG from "../../resources/icons/ThreeDots.svg";
import { useLocalization, useTheme } from "../../decorators";
import { SHOW_MORE_CRUMBS } from "../../utils/Localization";
import { getDropdownMenuMaxHeight } from "../Dropdown/Dropdown.utils";
import { getTextWidth } from "../../utils/textWidth";
import { AlignedTooltip } from "../AlignedTooltip";
import { breadcrumbsHomeLinkTestId, breadcrumbsShowMoreTestId } from "../../utils";
import { useCallback, useLayoutEffect, type ReactNode } from "react";
import type { ItemType } from "antd/es/menu/interface";
import { Tooltip } from "../Tooltip/Tooltip";

const tooltipAlign = { targetOffset: [0, -8] };

const BreadcrumbsComponent: React.FC<IBreadcrumbsProps> = ({
  items,
  visibleCount: propsVisibleCount,
  visibleCountWithLevels = 2,
  onHomeClick,
  homeTitle,
  showMoreTitle,
  maxAvailableContainerWidth = 720,
  crumbFontSize = 12,
  ...props
}) => {
  const localization = useLocalization();
  const separatorWidth = 16;
  const crumbXPadding = 0;

  const [containerWidth, setContainerElement] = useContainerWidth();
  const [labeledCrumbsWidth, setLabeledCrumbsElement, recalculateLabeledCrumbsWidth] =
    useContainerWidth();

  const visibleCount =
    !containerWidth ||
    (containerWidth >= maxAvailableContainerWidth && items.length <= propsVisibleCount)
      ? propsVisibleCount
      : visibleCountWithLevels;
  const visibleItems = takeRight(items, visibleCount);
  const hiddenItems = dropRight(items, visibleCount);

  const theme = useTheme();

  useLayoutEffect(() => {
    recalculateLabeledCrumbsWidth();
  }, [visibleItems]);

  function renderHome() {
    return (
      onHomeClick && (
        <Tooltip title={homeTitle} placement="top" align={tooltipAlign}>
          <div
            test-id={
              props["test-id"]
                ? `${props["test-id"]}_${breadcrumbsHomeLinkTestId}`
                : breadcrumbsHomeLinkTestId
            }
            key="home"
            css={crumbStyle}
            onClick={onHomeClick}
          >
            <HomeOutlined css={homeIconStyle(theme)} key="home" />
          </div>
        </Tooltip>
      )
    );
  }

  const dropdownRender = useCallback((menus: ReactNode) => {
    return (
      <div key="dropdown-wrapper" css={dropdownWrapperStyle}>
        {menus}
      </div>
    );
  }, []);

  const getMenu = useCallback(
    (menuItems: ItemType[], menuMaxHeight: number) => ({
      items: menuItems,
      style: getMenuStyle(menuMaxHeight),
    }),
    []
  );

  const renderShowMore = useCallback(() => {
    if (size(hiddenItems) === 0) {
      return null;
    }

    const menuItems = hiddenItems.map(({ key, name, onClick }) => ({
      key,
      label: <AlignedTooltip>{name}</AlignedTooltip>,
      onClick,
    }));
    const menuMaxHeight = getDropdownMenuMaxHeight({});
    const title = showMoreTitle ?? localization.getLocalized(SHOW_MORE_CRUMBS);

    return (
      <Dropdown
        key="show-more"
        menu={getMenu(menuItems, menuMaxHeight)}
        dropdownRender={dropdownRender}
      >
        <Tooltip title={title} placement="top" align={tooltipAlign}>
          <div
            test-id={
              props["test-id"]
                ? `${props["test-id"]}_${breadcrumbsShowMoreTestId}`
                : breadcrumbsShowMoreTestId
            }
            css={crumbStyle}
          >
            <ThreeDotsSVG style={threeDotsIconStyle} />
          </div>
        </Tooltip>
      </Dropdown>
    );
  }, [dropdownRender, getMenu, hiddenItems, localization, props, showMoreTitle]);

  const renderSeparator = useCallback(
    (i: number) => (
      <div key={i} css={getSeparatorStyle(separatorWidth)(theme)}>
        {"/"}
      </div>
    ),
    [theme]
  );

  const getTextShrinks = useCallback(() => {
    const minWidth = 85;
    // если придет нода, то в расчетах это будет как пустая строка. Нужно будет как то придумать расчеты
    // дле реакт-ноды, либо считать при передаче и помимо ноды передавать размер
    const widths = visibleItems.map(({ name }) =>
      getTextWidth(name?.toString() ?? "", { size: crumbFontSize })
    );
    /** Доступная ширина под текст крошек */
    const excessTextWidth =
      labeledCrumbsWidth - size(widths) * (crumbXPadding * 2 + separatorWidth);

    return calcShrinkMask(widths, excessTextWidth, minWidth).map(Number);
  }, [crumbFontSize, labeledCrumbsWidth, visibleItems]);

  const renderLabeledCrumbs = useCallback(() => {
    const shrinks = getTextShrinks();

    const crumbs = visibleItems.map((item, i) => {
      const style = [
        crumbStyle,
        last(visibleItems) === item ? lastCrumbTextStyle : null,
        { flexShrink: shrinks[i] },
      ];

      return (
        <div key={item.key} css={style} onClick={item.onClick}>
          <AlignedTooltip css={{ fontSize: crumbFontSize }}>{item.name}</AlignedTooltip>
        </div>
      );
    });

    return (
      <div key="text-crumbs" css={labeledCrumbsContainerStyle} ref={setLabeledCrumbsElement}>
        {interleaveWith(renderSeparator, crumbs)}
      </div>
    );
  }, [crumbFontSize, getTextShrinks, renderSeparator, setLabeledCrumbsElement, visibleItems]);

  return (
    <div css={containerStyle} ref={setContainerElement}>
      {interleaveWith(
        renderSeparator,
        compact([renderHome(), renderShowMore(), renderLabeledCrumbs()])
      )}
    </div>
  );
};

export const Breadcrumbs = BreadcrumbsComponent;

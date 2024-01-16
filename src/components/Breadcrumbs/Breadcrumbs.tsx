import { compact, dropRight, last, size, takeRight } from "lodash";
import { useContainerWidth } from "../../decorators/hooks/useContainerWidth";
import { HomeOutlined } from "../Icons/Icons";
import {
  containerStyle,
  crumbStyle,
  homeIconStyle,
  lastCrumbTextStyle,
  menuStyle,
  separatorStyle,
  labeledCrumbsContainerStyle,
  threeDotsIconStyle,
} from "./Breadcrumbs.styles";
import type { IBreadcrumbsProps } from "./Breadcrumbs.types";
import { calcShrinkMask, interleaveWith } from "./Breadcrumbs.utils";
import { Menu } from "antd";
import { Dropdown } from "../Dropdown/Dropdown";
import ThreeDotsSVG from "../../resources/icons/ThreeDots.svg";
import { Tooltip } from "../Tooltip/Tooltip";
import { useNavigate } from "react-router";
import { ellipsisStyle } from "../../styles/common.styles";
import { useTheme } from "../../decorators";
import { AutoTooltip } from "../AutoTooltip";
import { getTextWidth } from "../../utils/textWidth";

// "Хлебные крошки" для нового списка сотрудников, который еще не реализован
const BreadcrumbsComponent: React.FC<IBreadcrumbsProps> = ({
  items,
  visibleCount,
  homePath,
  homeTitle,
  showMoreTitle,
}) => {
  const separatorWidth = 8;
  const crumbXPadding = 4;
  const crumbFontSize = 12;

  const visibleItems = takeRight(items, visibleCount);
  const hiddenItems = dropRight(items, visibleCount);
  const [labeledCrumbsWidth, setLabeledCrumbsElement] = useContainerWidth();

  const navigate = useNavigate();
  const theme = useTheme();

  function createCrumbHandler(path: string) {
    return () => navigate(path);
  }

  function renderHome() {
    return (
      <div key="home" css={crumbStyle(crumbXPadding)(theme)} onClick={createCrumbHandler(homePath)}>
        <Tooltip title={homeTitle} placement="bottomLeft">
          <HomeOutlined css={homeIconStyle(theme)} key="home" />
        </Tooltip>
      </div>
    );
  }

  function renderShowMore() {
    if (size(hiddenItems) === 0) {
      return null;
    }

    const menuItems = hiddenItems.map(({ key, name, path }) => ({
      key,
      label: (
        <AutoTooltip placement="right">
          <div css={ellipsisStyle}>{name}</div>
        </AutoTooltip>
      ),
      onClick: createCrumbHandler(path),
    }));

    const menu = <Menu css={menuStyle} items={menuItems} />;

    return (
      <Dropdown key="show-more" overlay={menu}>
        <div css={crumbStyle(crumbXPadding)(theme)}>
          <Tooltip title={showMoreTitle} placement="bottomLeft">
            <ThreeDotsSVG style={threeDotsIconStyle} />
          </Tooltip>
        </div>
      </Dropdown>
    );
  }

  const renderSeparator = (i: number) => (
    <div key={i} css={separatorStyle(separatorWidth)(theme)}>
      {"/"}
    </div>
  );

  function getTextShrinks() {
    const minWidth = 85;
    const widths = visibleItems.map(({ name }) => getTextWidth(name, crumbFontSize));
    /** Доступная ширина под текст крошек */
    const excessTextWidth =
      labeledCrumbsWidth - size(widths) * (crumbXPadding * 2 + separatorWidth);
    return calcShrinkMask(widths, excessTextWidth, minWidth).map(Number);
  }

  function renderLabeledCrumbs() {
    const shrinks = getTextShrinks();

    const crumbs = visibleItems.map((item, i) => {
      const style = [
        crumbStyle(crumbXPadding),
        last(visibleItems) === item ? lastCrumbTextStyle : null,
        { flexShrink: shrinks[i] },
      ];

      return (
        <div key={item.key} css={style} onClick={createCrumbHandler(item.path)}>
          <AutoTooltip css={{ fontSize: crumbFontSize }} placement="bottomLeft">
            {item.name}
          </AutoTooltip>
        </div>
      );
    });

    return (
      <div key="text-crumbs" css={labeledCrumbsContainerStyle} ref={setLabeledCrumbsElement}>
        {interleaveWith(renderSeparator, crumbs)}
      </div>
    );
  }

  return (
    <div css={containerStyle}>
      {interleaveWith(
        renderSeparator,
        compact([renderHome(), renderShowMore(), renderLabeledCrumbs()])
      )}
    </div>
  );
};

export const Breadcrumbs = BreadcrumbsComponent;

import { Col } from "antd";
import React, { useCallback, useContext, useEffect, useMemo, useState, useRef } from "react";
import { generatePath, Link, useParams } from "react-router-dom";
import {
  titleStyle,
  wrapMenuTitleStyle,
  linkBackStyle,
  linkRootStyle,
  headerBodyRightStyle,
  spinnerStyle,
  getHeaderTitleStyle,
  getHeaderBodyCenterStyle,
  getHeaderBodyRightWithCenterStyle,
  headerBodyRightWithLeftWithoutCenterStyle,
  headerBodyRightWithoutLeftAndCenterStyle,
  titleOverlayStyle,
} from "./HeaderMenuPortal.styles";
import type {
  IHeaderMenuPortalProps,
  IHeaderMenuPortalBodyProps,
  IHeaderMenuPortalTitleProps,
  THeaderMenuColumnConfig,
} from "./HeaderMenuPortal.types";
import { mapValues, keyBy, isUndefined, isNull } from "lodash";
import {
  headerMenuBackUrlTestId,
  headerMenuLogoTestId,
  headerMenuTitleTestId,
  headerMenuBodyLeftTestId,
  headerMenuBodyRightTestId,
  headerMenuSettingsTestId,
  headerMenuBodyCenterTestId,
  navigationTabsTestId,
} from "../../../utils/TestIds";
import ReactDOM from "react-dom";
import { wrapMenuStyle } from "../HeaderMenu.styles";
import { HeaderMenuContext } from "../../../decorators/contexts/HeaderMenuContext";
import { MainSystemPagePathContext } from "../../../decorators/contexts/MainSystemPagePathContext";
import { useFeature } from "../../../decorators/hooks/useFeature";
import { ArrowBackSVG, HeaderAppsIconSVG } from "../../../resources/icons";
import { Spinner } from "../../Spinner/Spinner";
import { assertSimple } from "@infomaximum/assert";
import { useOverflow } from "../../../decorators/hooks/useOverflow";

const assertSimpleText = "Дочерний компонент не должен помещаться в DOM";

class Title extends React.PureComponent<IHeaderMenuPortalTitleProps> {
  public override render(): React.ReactNode {
    assertSimple(false, assertSimpleText);

    return null;
  }
}

class Body extends React.PureComponent<IHeaderMenuPortalBodyProps> {
  public override render(): React.ReactNode {
    assertSimple(false, assertSimpleText);

    return null;
  }
}

const defaultCalculateColumnConfig = (wrapperWidth: number): THeaderMenuColumnConfig => {
  if (wrapperWidth >= 1920) {
    return { rightColWidth: 474, leftColWidth: 474 };
  } else if (wrapperWidth >= 1680) {
    return { rightColWidth: 414, leftColWidth: 414 };
  } else if (wrapperWidth >= 1440) {
    return { rightColWidth: 356, leftColWidth: 356 };
  } else if (wrapperWidth >= 1280) {
    return { rightColWidth: 316, leftColWidth: 316 };
  } else if (wrapperWidth >= 1024) {
    return { rightColWidth: 254, leftColWidth: 254 };
  } else if (wrapperWidth >= 600) {
    return { rightColWidth: 200, leftColWidth: 200 };
  } else {
    return { rightColWidth: 168, leftColWidth: 168 };
  }
};

const HeaderMenuPortalComponent: React.FC<IHeaderMenuPortalProps> & {
  Title: typeof Title;
  Body: typeof Body;
} = ({ calculateColumnConfig = defaultCalculateColumnConfig, children }) => {
  const headerContainer = useContext(HeaderMenuContext);
  const mainSystemPagePath = useContext(MainSystemPagePathContext);
  const [currentWrapperWidth, setCurrentWrapperWidth] = useState(window.innerWidth);
  const [columnConfig, setColumnConfig] = useState(calculateColumnConfig(currentWrapperWidth));
  const { isFeatureEnabled } = useFeature();
  const ref = useRef<HTMLDivElement>(null);
  const { isOverflow } = useOverflow(ref, children);

  const getVisibleSettingsIcon = useCallback(
    () => !isNull(document.getElementById(headerMenuSettingsTestId)),
    []
  );

  const [isVisibleSettingsIcon, setVisibleSettingsIcon] = useState(getVisibleSettingsIcon);

  const params = useParams();

  useEffect(() => {
    setVisibleSettingsIcon(getVisibleSettingsIcon());
  }, [getVisibleSettingsIcon, isFeatureEnabled]);

  const mappedChildren = useMemo(() => {
    const childrenArray: any[] = React.Children.toArray(children);

    return mapValues(
      keyBy(childrenArray, (child) => {
        switch (child.type) {
          case HeaderMenuPortalComponent.Title:
            return "headerTitle";

          case HeaderMenuPortalComponent.Body:
            switch (child.props.align) {
              case "left":
                return "headerBodyLeft";
              case "center":
                return "headerBodyCenter";
              case "right":
                return "headerBodyRight";
              default:
                return "headerBodyLeft";
            }

          default:
            return;
        }
      }),
      (child) => child.props
    );
  }, [children]);

  const { headerTitle, headerBodyLeft, headerBodyRight, headerBodyCenter } = mappedChildren;
  const headerBodyLeftChildren = headerBodyLeft?.children;
  const headerBodyRightChildren = headerBodyRight?.children;
  const headerBodyCenterChildren = headerBodyCenter?.children;

  useEffect(() => {
    const handleWindowResize = () => {
      const wrapperWidth = window.innerWidth;

      if (Math.abs(wrapperWidth - currentWrapperWidth) > 5) {
        setCurrentWrapperWidth(wrapperWidth);
        setColumnConfig(() => calculateColumnConfig(wrapperWidth));
      }
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  });

  const getHeaderBodyLeft = () => {
    if (!headerTitle && !headerBodyLeftChildren) {
      return null;
    }

    const { backUrl, children, loading, customTitleStyle, hasCenterTabs } = headerTitle;

    return (
      <Col
        key="header-menu-title-wrap"
        css={wrapMenuTitleStyle}
        style={hasCenterTabs ? getHeaderTitleStyle(columnConfig.leftColWidth) : undefined}
      >
        {backUrl ? (
          <Link
            test-id={headerMenuBackUrlTestId}
            to={generatePath(backUrl, params)}
            css={linkBackStyle}
          >
            <ArrowBackSVG />
          </Link>
        ) : (
          <Link
            test-id={headerMenuLogoTestId}
            to={mainSystemPagePath}
            key="logo-icon"
            css={linkRootStyle}
          >
            <HeaderAppsIconSVG />
          </Link>
        )}
        <div
          css={[customTitleStyle ?? titleStyle, isOverflow && titleOverlayStyle]}
          test-id={headerMenuTitleTestId}
          ref={ref}
        >
          {loading ? <Spinner wrapperStyle={spinnerStyle} size="small" /> : children}
        </div>
        {headerBodyLeftChildren ? (
          <div key="header-menu-left-wrap" css={wrapMenuStyle} test-id={headerMenuBodyLeftTestId}>
            {headerBodyLeftChildren}
          </div>
        ) : null}
      </Col>
    );
  };

  const getHeaderBodyCenter = () => {
    if (headerBodyCenterChildren) {
      return (
        <Col
          key="header-menu-center-wrap"
          flex="auto"
          css={wrapMenuStyle}
          test-id={headerMenuBodyCenterTestId}
          style={getHeaderBodyCenterStyle(columnConfig, isVisibleSettingsIcon)}
        >
          {headerBodyCenterChildren}
        </Col>
      );
    }

    return null;
  };

  const getHeaderBodyRight = () => {
    const navigationTabs = document.getElementById(navigationTabsTestId); // Не удается определить наличие средней колонки чтением headerBodyCenter.children

    if (headerBodyRightChildren) {
      return (
        <Col
          key="header-menu-right-wrap"
          css={headerBodyRightStyle}
          test-id={headerMenuBodyRightTestId}
          style={
            navigationTabs
              ? getHeaderBodyRightWithCenterStyle(columnConfig.rightColWidth, isVisibleSettingsIcon)
              : !isUndefined(headerBodyLeftChildren)
              ? headerBodyRightWithLeftWithoutCenterStyle
              : headerBodyRightWithoutLeftAndCenterStyle
          }
        >
          {headerBodyRightChildren}
        </Col>
      );
    }

    return null;
  };

  return headerContainer
    ? ReactDOM.createPortal(
        <>
          {getHeaderBodyLeft()}
          {getHeaderBodyCenter()}
          {getHeaderBodyRight()}
        </>,
        headerContainer
      )
    : null;
};

HeaderMenuPortalComponent.Title = Title;
HeaderMenuPortalComponent.Body = Body;

export const HeaderMenuPortal = HeaderMenuPortalComponent;

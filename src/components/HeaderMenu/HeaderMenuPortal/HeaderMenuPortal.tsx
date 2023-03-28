import { Col } from "antd";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
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
} from "./HeaderMenuPortal.styles";
import type {
  IHeaderMenuPortalProps,
  IHeaderMenuPortalBodyProps,
  IHeaderMenuPortalTitleProps,
} from "./HeaderMenuPortal.types";
import { mapValues, keyBy, isUndefined, isNull } from "lodash";
import {
  headerMenuBackUrlTestId,
  headerMenuLogoTestId,
  headerMenuTitleTestId,
  headerMenuBodyLeftTestId,
  headerMenuBodyRightTestId,
  navigationTabsTestId,
  headerMenuSettingsTestId,
  headerMenuBodyCenterTestId,
} from "../../../utils/TestIds";
import ReactDOM from "react-dom";
import { wrapMenuStyle } from "../HeaderMenu.styles";
import { HeaderMenuContext } from "../../../decorators/contexts/HeaderMenuContext";
import { MainSystemPagePathContext } from "../../../decorators/contexts/MainSystemPagePathContext";
import { useFeature } from "../../../decorators/hooks/useFeature";
import { ArrowBackSVG, HeaderAppsIconSVG } from "../../../resources/icons";
import { Spinner } from "../../Spinner/Spinner";
import { assertSimple } from "@infomaximum/assert";

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

const calculateValues = (wrapperWidth: number) => {
  if (wrapperWidth > 1920) {
    return 474;
  } else if (wrapperWidth > 1680) {
    return 414;
  } else if (wrapperWidth > 1440) {
    return 356;
  } else if (wrapperWidth > 1280) {
    return 316;
  } else if (wrapperWidth > 1024) {
    return 254;
  } else if (wrapperWidth > 600) {
    return 200;
  } else {
    return 168;
  }
};

const HeaderMenuPortalComponent: React.FC<IHeaderMenuPortalProps> & {
  Title: typeof Title;
  Body: typeof Body;
} = ({ children }) => {
  const headerContainer = useContext(HeaderMenuContext);
  const mainSystemPagePath = useContext(MainSystemPagePathContext);
  const [currentWrapperWidth, setCurrentWrapperWidth] = useState(window.innerWidth);
  const [sideColumnWidth, setSideColumnWidth] = useState(calculateValues(currentWrapperWidth));
  const { isFeatureEnabled } = useFeature();

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

  useEffect(() => {
    const handleWindowResize = () => {
      const wrapperWidth = window.innerWidth;
      if (Math.abs(wrapperWidth - currentWrapperWidth) > 5) {
        setCurrentWrapperWidth(wrapperWidth);
        setSideColumnWidth(calculateValues(wrapperWidth));
      }
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  });

  const getHeaderTitle = (
    headerTitle: IHeaderMenuPortalTitleProps,
    headerBodyLeftChildren: React.ReactNode
  ) => {
    if (!headerTitle) {
      return null;
    }

    const { backUrl, children, loading, customTitleStyle } = headerTitle;
    const flexValue = !headerBodyLeftChildren ? "auto" : undefined;
    return (
      <Col
        key="header-menu-title-wrap"
        flex={flexValue}
        css={wrapMenuTitleStyle}
        style={
          headerBodyLeftChildren || customTitleStyle
            ? undefined
            : getHeaderTitleStyle(sideColumnWidth)
        }
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
        <div css={customTitleStyle ?? titleStyle} test-id={headerMenuTitleTestId}>
          {loading ? <Spinner wrapperStyle={spinnerStyle} size="small" /> : children}
        </div>
      </Col>
    );
  };

  const getHeaderBodyLeft = (headerBodyLeftChildren: React.ReactNode) => {
    if (headerBodyLeftChildren) {
      return (
        <Col
          key="header-menu-left-wrap"
          flex="auto"
          css={wrapMenuStyle}
          test-id={headerMenuBodyLeftTestId}
        >
          {headerBodyLeftChildren}
        </Col>
      );
    }
    return null;
  };

  const getHeaderBodyCenter = (headerBodyCenterChildren: React.ReactNode) => {
    if (headerBodyCenterChildren) {
      return (
        <Col
          key="header-menu-center-wrap"
          flex="auto"
          css={wrapMenuStyle}
          test-id={headerMenuBodyCenterTestId}
          style={getHeaderBodyCenterStyle(sideColumnWidth, isVisibleSettingsIcon)}
        >
          {headerBodyCenterChildren}
        </Col>
      );
    }
    return null;
  };

  const getHeaderBodyRight = (
    headerBodyLeftChildren: React.ReactNode,
    isHeaderBodyCenterChildren: boolean,
    headerBodyRightChildren: React.ReactNode
  ) => {
    if (headerBodyRightChildren) {
      return (
        <Col
          key="header-menu-right-wrap"
          css={headerBodyRightStyle}
          test-id={headerMenuBodyRightTestId}
          style={
            isHeaderBodyCenterChildren
              ? getHeaderBodyRightWithCenterStyle(sideColumnWidth, isVisibleSettingsIcon)
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

  const headerBodyCenterChildren = document.getElementById(navigationTabsTestId);

  return headerContainer
    ? ReactDOM.createPortal(
        <>
          {getHeaderTitle(headerTitle, headerBodyLeft?.children)}
          {getHeaderBodyLeft(headerBodyLeft?.children)}
          {getHeaderBodyCenter(headerBodyCenter?.children)}
          {getHeaderBodyRight(
            headerBodyLeft?.children,
            !!headerBodyCenterChildren,
            headerBodyRight?.children
          )}
        </>,
        headerContainer
      )
    : null;
};

HeaderMenuPortalComponent.Title = Title;
HeaderMenuPortalComponent.Body = Body;

export const HeaderMenuPortal = HeaderMenuPortalComponent;

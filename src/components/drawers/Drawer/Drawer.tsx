import React, { useState, useEffect, useMemo } from "react";
// eslint-disable-next-line im/ban-import-entity
import { Drawer as AntDrawer } from "antd";
import type { IDrawerProps } from "./Drawer.types";
import { createSelector } from "reselect";
import {
  boldTitleStyle,
  drawerStyle,
  headerDrawerStyle,
  closeIconStyle,
  titleStyle,
  closeIconWrapperStyle,
} from "./Drawer.styles";
import { drawerCloseButtonTestId } from "../../../utils/TestIds";
import { CloseOutlined } from "../../Icons/Icons";
import { useTheme } from "../../../decorators/hooks/useTheme";

export const getBoldTitle = createSelector(
  (title: React.ReactNode) => title,
  (title: React.ReactNode) => <span style={boldTitleStyle}>{title}</span>
);

const DrawerComponent: React.FC<IDrawerProps> = (props) => {
  const { title, closeIcon: closeIconProps, visible, ...rest } = props;
  const [isFirstRender, firstRenderCheck] = useState(true);

  const drawerVisible = isFirstRender ? false : visible;
  const theme = useTheme();

  useEffect(() => {
    firstRenderCheck(false);
  }, []);

  const boldTitle = useMemo(
    () => <span css={titleStyle}>{title}</span>,
    [title]
  );

  const closeIcon = useMemo(() => {
    return (
      <div css={closeIconWrapperStyle}>
        <CloseOutlined
          css={closeIconStyle}
          key="drawer-close-button"
          test-id={drawerCloseButtonTestId}
        />
      </div>
    );
  }, []);

  return (
    <AntDrawer
      css={drawerStyle}
      headerStyle={headerDrawerStyle(theme)}
      title={title && boldTitle}
      closeIcon={closeIcon}
      {...rest}
      visible={drawerVisible}
    />
  );
};

export const Drawer = DrawerComponent;

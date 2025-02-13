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
  footerDrawerStyle,
  wrapperDrawerStyle,
} from "./Drawer.styles";
import { drawerCloseButtonTestId } from "../../../utils/TestIds";
import { CloseOutlined } from "../../Icons/Icons";
import { useTheme } from "../../../decorators/hooks/useTheme";
import { AlignedTooltip } from "../../AlignedTooltip";

export const getBoldTitle = createSelector(
  (title: React.ReactNode) => title,
  (title: React.ReactNode) => <span style={boldTitleStyle}>{title}</span>
);

const DrawerComponent: React.FC<IDrawerProps> = (props) => {
  const { title, closeIcon: closeIconProps, open, styles: stylesProps, ...rest } = props;
  const [isFirstRender, firstRenderCheck] = useState(true);

  const drawerOpen = isFirstRender ? false : open;
  const theme = useTheme();

  useEffect(() => {
    firstRenderCheck(false);
  }, []);

  const boldTitle = useMemo(
    () => (
      <AlignedTooltip>
        <span css={titleStyle}>{title}</span>
      </AlignedTooltip>
    ),
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

  const styles = useMemo(
    () => ({
      ...stylesProps,
      header: { ...headerDrawerStyle, ...stylesProps?.header },
      footer: { ...footerDrawerStyle(theme), ...stylesProps?.footer },
      wrapper: { ...wrapperDrawerStyle, ...stylesProps?.wrapper },
    }),
    [stylesProps, theme]
  );

  return (
    <AntDrawer
      getContainer={document.body} // todo: Не удалять до решения issue https://github.com/ant-design/ant-design/issues/41239
      autoFocus={false} // по умолчанию false, чтобы работал autoFocus полей внутри drawer
      css={drawerStyle}
      title={title && boldTitle}
      closeIcon={closeIcon}
      styles={styles}
      {...rest}
      open={drawerOpen}
      zIndex={theme.drawerZIndex}
    />
  );
};

export const Drawer = DrawerComponent;

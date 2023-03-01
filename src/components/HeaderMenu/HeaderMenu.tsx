import { Layout, Row, Col } from "antd";
import React, { useCallback, useContext, useMemo, useState } from "react";
import {
  headerStyle,
  linkSettingsStyle,
  wrapStaticMenuStyle,
  headerRowStyle,
  drawerBodyStyle,
  headerWithSettingsIconStyle,
  headerWithoutSettingsIconStyle,
  footerStyle,
  headerSettingsDrawerStyle,
} from "./HeaderMenu.styles";
import { find, forEach, isEmpty } from "lodash";
import { headerMenuSettingsTestId, headerMenuTestId } from "../../utils/TestIds";
import { observer } from "mobx-react";
import { ProfileDropdown } from "./ProfileDropdown/ProfileDropdown";
import { profileKey, settingsKey } from "../../utils/Routes/keys";
import type { IProfileMenuItem } from "./ProfileDropdown/ProfileDropdown.types";
import type { IHeaderMenuProps } from "./HeaderMenu.types";
import { useTheme } from "../../decorators/hooks/useTheme";
import { RoutesContext } from "../../decorators/contexts/RoutesContext";
import { getDisplayedSettingsRoutes } from "../../utils/Routes/routes";
import { SettingsSVG } from "../../resources/icons";
import { Drawer } from "../drawers/Drawer/Drawer";
import { Settings } from "../Settings/Settings";

const { Header } = Layout;

const HeaderMenuComponent = React.forwardRef<HTMLDivElement, IHeaderMenuProps>(
  ({ renderSettingsFooterDrawer, userId, userName, onLogout }, ref) => {
    const theme = useTheme();
    const [showSettingsDrawer, setShowSettingsDrawer] = useState<boolean>(false);
    const routes = useContext(RoutesContext);

    const settingsRoutes = useMemo(() => {
      const settingsRoute = find(routes, (route) => route.key === settingsKey);

      return settingsRoute && getDisplayedSettingsRoutes(settingsRoute.routes);
    }, [routes]);

    const isVisibleSettingsIcon = !isEmpty(settingsRoutes);

    const profileMenuItems = useMemo(() => {
      const profileRoute = find(routes, (route) => route.key === profileKey);

      const items: IProfileMenuItem[] = [];

      forEach(profileRoute?.routes, ({ isRedirectRoute, key, loc, path, icon }) => {
        if (!isRedirectRoute && key && loc && path && icon) {
          items.push({ key, loc, path, icon });
        }
      });

      return items;
    }, [routes]);

    const handleSettingsIconClick = useCallback(() => {
      setShowSettingsDrawer(true);
    }, []);

    const handleCloseDrawer = useCallback(() => {
      setShowSettingsDrawer(false);
    }, []);

    const headerNavigation = (
      <Col key="header-menu-settings-wrap" css={wrapStaticMenuStyle}>
        {isVisibleSettingsIcon ? (
          <div
            id={headerMenuSettingsTestId}
            test-id={headerMenuSettingsTestId}
            css={linkSettingsStyle}
            onClick={handleSettingsIconClick}
          >
            <SettingsSVG />
          </div>
        ) : null}
        <ProfileDropdown
          menuItems={profileMenuItems}
          userId={userId}
          userName={userName}
          onLogout={onLogout}
        />
      </Col>
    );

    const footer = useMemo(() => {
      if (typeof renderSettingsFooterDrawer === "function") {
        return renderSettingsFooterDrawer({ onClick: handleCloseDrawer });
      }
    }, [handleCloseDrawer, renderSettingsFooterDrawer]);

    const settingsDrawer = (
      <Drawer
        key="settings-drawer"
        width={theme.drawerMediumWidth}
        placement="right"
        closable={true}
        onClose={handleCloseDrawer}
        visible={showSettingsDrawer}
        bodyStyle={drawerBodyStyle}
        footer={footer}
        footerStyle={footerStyle}
        destroyOnClose={true}
        headerStyle={headerSettingsDrawerStyle}
      >
        {settingsRoutes && !isEmpty(settingsRoutes) ? (
          <Settings onItemClick={handleCloseDrawer} routes={settingsRoutes} />
        ) : null}
      </Drawer>
    );

    return (
      <Header css={headerStyle} test-id={headerMenuTestId}>
        <Row align="middle" css={headerRowStyle}>
          <Col
            flex="auto"
            style={
              isVisibleSettingsIcon ? headerWithSettingsIconStyle : headerWithoutSettingsIconStyle
            }
          >
            <Row align="middle" css={headerRowStyle} ref={ref} />
          </Col>
          {headerNavigation}
        </Row>
        {settingsDrawer}
      </Header>
    );
  }
);

export const HeaderMenu = observer(HeaderMenuComponent);

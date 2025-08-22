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
import { headerMenuSettingsTestId, headerMenuTestId } from "@infomaximum/base/src/utils/TestIds";
import { observer } from "mobx-react";
import { ProfileDropdown } from "./ProfileDropdown/ProfileDropdown";
import { profileKey, settingsKey } from "@infomaximum/base/src/utils/Routes/keys";
import type { IProfileMenuItem } from "./ProfileDropdown/ProfileDropdown.types";
import type { IHeaderMenuProps } from "./HeaderMenu.types";
import { useTheme } from "@infomaximum/base/src/decorators/hooks/useTheme";
import { RoutesContext } from "@infomaximum/base/src/decorators/contexts/RoutesContext";
import { getDisplayedSettingsRoutes } from "@infomaximum/base/src/utils/Routes/routes";
import { Drawer } from "../drawers/Drawer/Drawer";
import { Settings } from "../Settings/Settings";
import type { DrawerStyles } from "antd/lib/drawer/DrawerPanel";
import { useFeature, useLocalization } from "@infomaximum/base/src/decorators";
import { ADMINISTRATION } from "@infomaximum/base/src/utils";
import { Tooltip } from "../Tooltip";
import { useLocation } from "react-router";
import { filterChildrenRouts } from "./HeaderMenu.utils";
import { SettingFilled } from "../Icons";

const { Header } = Layout;
const tooltipAlign = { targetOffset: [0, 2] };

const HeaderMenuComponent = React.forwardRef<HTMLDivElement, IHeaderMenuProps>(
  ({ renderSettingsFooterDrawer, userId, userName, onLogout, className }, ref) => {
    const theme = useTheme();
    const localization = useLocalization();
    const [showSettingsDrawer, setShowSettingsDrawer] = useState<boolean>(false);
    const routes = useContext(RoutesContext);
    const { isFeatureEnabled } = useFeature();
    const location = useLocation();

    const settingsRoutes = useMemo(() => {
      const settingsRoute = find(routes, (route) => route.key === settingsKey);
      const settingsChildrenRoutes = filterChildrenRouts(settingsRoute, isFeatureEnabled, location);

      return settingsRoute && getDisplayedSettingsRoutes(settingsChildrenRoutes);
    }, [isFeatureEnabled, location, routes]);

    const isVisibleSettingsIcon = !isEmpty(settingsRoutes);

    const profileMenuItems = useMemo(() => {
      const profileRoute = find(routes, (route) => route.key === profileKey);
      const profileChildrenRoutes = filterChildrenRouts(profileRoute, isFeatureEnabled, location);

      const items: IProfileMenuItem[] = [];

      forEach(profileChildrenRoutes, ({ isRedirectRoute, key, loc, path, icon }) => {
        if (!isRedirectRoute && key && loc && path && icon) {
          items.push({ key, loc, path, icon });
        }
      });

      return items;
    }, [isFeatureEnabled, location, routes]);

    const handleSettingsIconClick = useCallback(() => {
      setShowSettingsDrawer(true);
    }, []);

    const handleCloseDrawer = useCallback(() => {
      setShowSettingsDrawer(false);
    }, []);

    const headerNavigation = (
      <Col key="header-menu-settings-wrap" css={wrapStaticMenuStyle}>
        {isVisibleSettingsIcon ? (
          <Tooltip
            align={tooltipAlign}
            title={localization.getLocalized(ADMINISTRATION)}
            placement="bottom"
          >
            <div
              id={headerMenuSettingsTestId}
              test-id={headerMenuSettingsTestId}
              css={linkSettingsStyle}
              onClick={handleSettingsIconClick}
            >
              <SettingFilled />
            </div>
          </Tooltip>
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

    const drawerStyles = useMemo(
      () =>
        ({
          header: headerSettingsDrawerStyle,
          body: drawerBodyStyle,
          footer: footerStyle,
        }) satisfies DrawerStyles,
      []
    );

    const settingsDrawer = (
      <Drawer
        key="settings-drawer"
        width={theme.drawerMediumWidth}
        placement="right"
        closable={true}
        onClose={handleCloseDrawer}
        open={showSettingsDrawer}
        styles={drawerStyles}
        footer={footer}
        destroyOnClose={true}
      >
        {settingsRoutes && !isEmpty(settingsRoutes) ? (
          <Settings onItemClick={handleCloseDrawer} routes={settingsRoutes} />
        ) : null}
      </Drawer>
    );

    return (
      <Header css={headerStyle} test-id={headerMenuTestId} className={className}>
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

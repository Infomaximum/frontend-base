import { LOG_OUT, MY_PROFILE } from "../../../utils/Localization/Localization";
import { headerMenuUserAvatarTestId, logoutButtonTestId } from "../../../utils/TestIds";
import { Col, Menu, Row } from "antd";
import { iconsHoverStyle } from "../HeaderMenu.styles";
import type { IProfileDropdownProps } from "./ProfileDropdown.types";
import {
  antDropdownMenuSelectedItemClassName,
  iconMenuItemStyle,
  menuItemTextStyle,
  menuStyle,
} from "./ProfileDropdown.styles";
import { useMemo, useCallback } from "react";
import { map } from "lodash";
import { Link, matchPath, useLocation } from "react-router-dom";
import type { ItemType } from "antd/lib/menu/interface";
import { useLocalization } from "../../../decorators/hooks/useLocalization";
import { LogoutSVG } from "../../../resources/icons";
import { Dropdown } from "../../Dropdown/Dropdown";
import { HeaderAvatar } from "../HeaderAvatar/HeaderAvatar";
import { Tooltip } from "../../Tooltip/Tooltip";

const tooltipAlign = { targetOffset: [0, 2] };

const ProfileDropdownComponent: React.FC<IProfileDropdownProps> = ({
  menuItems: menuItemsProp,
  userId,
  userName,
  onLogout,
}) => {
  const location = useLocation();
  const localization = useLocalization();

  const menuItems = useMemo<ItemType[]>(() => {
    function renderItem(icon: React.ReactNode, text: string, testId?: string) {
      return (
        <Row gutter={8} align="middle" test-id={testId} wrap={false}>
          <Col css={iconMenuItemStyle}>{icon}</Col>
          <Col css={menuItemTextStyle}>{text}</Col>
        </Row>
      );
    }

    return [
      ...map(menuItemsProp, ({ key, loc, path, icon: Icon }) => {
        const isCurrentPath = matchPath(`${path}/*`, location.pathname);

        const content = renderItem(<Icon />, localization.getLocalized(loc));

        return {
          key,
          className: isCurrentPath ? antDropdownMenuSelectedItemClassName : undefined,
          label: isCurrentPath ? content : <Link to={path}>{content}</Link>,
        };
      }),
      { type: "divider" },
      {
        key: "logout",
        onClick: onLogout,
        label: renderItem(<LogoutSVG />, localization.getLocalized(LOG_OUT), logoutButtonTestId),
      },
    ];
  }, [onLogout, localization, location.pathname, menuItemsProp]);

  const dropdownRender = useCallback(() => {
    return <Menu css={menuStyle} items={menuItems} />;
  }, [menuItems]);

  const trigger = useMemo(() => ["click" as const], []);

  return (
    <Tooltip align={tooltipAlign} title={localization.getLocalized(MY_PROFILE)} placement="bottom">
      {/* Без фрагмента будет ошибка в консоли */}
      <>
        <Dropdown trigger={trigger} dropdownRender={dropdownRender}>
          <div css={iconsHoverStyle} test-id={headerMenuUserAvatarTestId}>
            <HeaderAvatar userId={userId} userName={userName} />
          </div>
        </Dropdown>
      </>
    </Tooltip>
  );
};

export const ProfileDropdown = ProfileDropdownComponent;

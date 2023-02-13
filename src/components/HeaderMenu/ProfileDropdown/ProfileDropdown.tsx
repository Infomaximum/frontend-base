import { LOG_OUT } from "../../../utils/Localization/Localization";
import {
  headerMenuUserAvatarTestId,
  logoutButtonTestId,
} from "../../../utils/TestIds";
import { Col, Menu, Row } from "antd";
import { iconsHoverStyle } from "../HeaderMenu.styles";
import type { IProfileDropdownProps } from "./ProfileDropdown.types";
import {
  antDropdownMenuSelectedItemClassName,
  iconMenuItemStyle,
  menuStyle,
} from "./ProfileDropdown.styles";
import { useMemo } from "react";
import { map } from "lodash";
import { Link, matchPath, useLocation } from "react-router-dom";
import type { ItemType } from "antd/lib/menu/hooks/useItems";
import { useLocalization } from "../../../decorators/hooks/useLocalization";
import { LogoutSVG } from "../../../resources/icons";
import { Dropdown } from "../../Dropdown/Dropdown";
import { HeaderAvatar } from "../HeaderAvatar/HeaderAvatar";

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
        <Row gutter={8} align="middle" test-id={testId}>
          <Col css={iconMenuItemStyle}>{icon}</Col>
          <Col>{text}</Col>
        </Row>
      );
    }

    return [
      ...map(menuItemsProp, ({ key, loc, path, icon: Icon }) => {
        const isCurrentPath = matchPath(path, location.pathname);

        const content = renderItem(<Icon />, localization.getLocalized(loc));

        return {
          key,
          className: isCurrentPath
            ? antDropdownMenuSelectedItemClassName
            : undefined,
          label: isCurrentPath ? content : <Link to={path}>{content}</Link>,
        };
      }),
      { type: "divider" },
      {
        key: "logout",
        onClick: onLogout,
        label: renderItem(
          <LogoutSVG />,
          localization.getLocalized(LOG_OUT),
          logoutButtonTestId
        ),
      },
    ];
  }, [onLogout, localization, location.pathname, menuItemsProp]);

  const overlay = useMemo(() => {
    return <Menu css={menuStyle} items={menuItems} />;
  }, [menuItems]);

  const trigger = useMemo(() => ["click" as const], []);

  return (
    <Dropdown trigger={trigger} overlay={overlay}>
      <div css={iconsHoverStyle} test-id={headerMenuUserAvatarTestId}>
        <HeaderAvatar userId={userId} userName={userName} />
      </div>
    </Dropdown>
  );
};

export const ProfileDropdown = ProfileDropdownComponent;

import React, { useMemo } from "react";
import { Avatar } from "antd";
import type { IHeaderAvatarProps, TAvatarColorConfig } from "./HeaderAvatar.types";
import { getColorConfigList, getIconAvatarStyle } from "./HeaderAvatar.styles";
import { observer } from "mobx-react";
import { useTheme } from "../../../decorators/hooks/useTheme";

const HeaderAvatarComponent: React.FC<IHeaderAvatarProps> = ({ userName, userId }) => {
  const theme = useTheme();

  const iconAvatarStyle = useMemo(() => {
    const colorConfig = getColorConfigList(theme);
    const avatarColorConfig = colorConfig[
      Number(userId) % colorConfig.length
    ] as TAvatarColorConfig;

    return getIconAvatarStyle(theme, avatarColorConfig);
  }, [userId, theme]);

  return (
    <Avatar key="header-avatar" style={iconAvatarStyle} size={20}>
      {userName?.substring(0, 1).toUpperCase() ?? ""}
    </Avatar>
  );
};

export const HeaderAvatar = observer(HeaderAvatarComponent);

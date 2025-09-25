import React, { useMemo } from "react";
import { Avatar, avatarColors } from "@infomaximum/ui-kit";
import type { IHeaderAvatarProps } from "./HeaderAvatar.types";
import { observer } from "mobx-react";

const HeaderAvatarComponent: React.FC<IHeaderAvatarProps> = ({
  userName,
  userId,
  size = "small",
}) => {
  const avatarColor = useMemo(() => avatarColors[Number(userId) % avatarColors.length], [userId]);

  return (
    <Avatar key="header-avatar" size={size} color={avatarColor}>
      {userName || ""}
    </Avatar>
  );
};

export const HeaderAvatar = observer(HeaderAvatarComponent);

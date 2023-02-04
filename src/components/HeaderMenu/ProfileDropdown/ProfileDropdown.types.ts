import type { NCore } from "@im/core";
import type { IHeaderAvatarProps } from "../HeaderAvatar/HeaderAvatar.types";

export interface IProfileMenuItem
  extends Required<Pick<NCore.IRoutes, "key" | "loc" | "path" | "icon">> {}

export interface IProfileDropdownProps extends Pick<IHeaderAvatarProps, "userName" | "userId"> {
  menuItems: IProfileMenuItem[];

  onLogout: () => void;
}

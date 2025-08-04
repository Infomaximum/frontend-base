import type { NCore } from "../../../libs/core";
import type { IHeaderAvatarProps } from "../HeaderAvatar/HeaderAvatar.types";

export interface IProfileMenuItem
  extends Required<Pick<NCore.IRoute, "key" | "loc" | "path" | "icon">> {}

export interface IProfileDropdownProps extends Pick<IHeaderAvatarProps, "userName" | "userId"> {
  menuItems: IProfileMenuItem[];

  onLogout: () => void;
}

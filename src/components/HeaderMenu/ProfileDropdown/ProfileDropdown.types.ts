import type { NCore } from "@infomaximum/module-expander";
import type { IHeaderAvatarProps } from "../HeaderAvatar/HeaderAvatar.types";

export interface IProfileMenuItem
  extends Required<Pick<NCore.IRoutes, "key" | "loc" | "path" | "icon">> {}

export interface IProfileDropdownProps extends Pick<IHeaderAvatarProps, "userName" | "userId"> {
  menuItems: IProfileMenuItem[];

  onLogout: () => void;
}

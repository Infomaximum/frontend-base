import type { IProfileDropdownProps } from "./ProfileDropdown/ProfileDropdown.types";

export type TRenderSettingsFooterDrawerParams = {
  onClick: () => void;
};

export interface IHeaderMenuProps
  extends Pick<IProfileDropdownProps, "userName" | "userId" | "onLogout"> {
  renderSettingsFooterDrawer?: (params: TRenderSettingsFooterDrawerParams) => React.ReactNode;
}

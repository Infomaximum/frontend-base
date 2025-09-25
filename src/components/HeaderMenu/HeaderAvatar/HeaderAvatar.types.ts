import type { AvatarProps } from "@infomaximum/ui-kit";

export interface IHeaderAvatarProps extends Pick<AvatarProps, "size"> {
  userId: number;
  userName: string;
}

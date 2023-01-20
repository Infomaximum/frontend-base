import type { Interpolation } from "@emotion/react";

export interface IBaseCardProps {
  children: React.ReactNode;
  title?: React.ReactNode | string;
  styleWrapper?: Interpolation<TTheme>;
  headStyle?: Interpolation<TTheme>;
  bodyStyle?: Interpolation<TTheme>;
  onAnimationEnd?: () => void;
  menu?: React.ReactNode | string;
  ["test-id"]?: string;
}

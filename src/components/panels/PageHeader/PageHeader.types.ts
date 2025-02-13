import type { PageHeaderProps } from "@ant-design/pro-layout";
import type { Interpolation } from "@emotion/react";

export interface IPageHeaderProps extends PageHeaderProps {
  ["test-id"]?: string;
  titleStyle?: Interpolation<TTheme>;
  leftOutlinedIcon?: React.ReactNode;
  titleWrapperStyle?: Interpolation<TTheme>;
}

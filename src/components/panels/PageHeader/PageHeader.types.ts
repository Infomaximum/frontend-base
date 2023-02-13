import type { Interpolation } from "@emotion/react";
import type { PageHeaderProps } from "antd/lib/page-header";

export interface IPageHeaderProps extends PageHeaderProps {
  ["test-id"]?: string;
  titleStyle?: Interpolation<TTheme>;
  leftOutlinedIcon?: React.ReactNode;
  titleWrapperStyle?: Interpolation<TTheme>;
}

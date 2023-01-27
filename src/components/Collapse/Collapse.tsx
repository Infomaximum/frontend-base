import type { ICollapseProps } from "./Collapse.types";
import { Collapse as AntCollapse } from "antd";

const CollapseComponent: React.FC<ICollapseProps> = (props) => {
  const { children, collapseStyle, ...rest } = props;

  return (
    <AntCollapse {...rest} css={collapseStyle}>
      {children}
    </AntCollapse>
  );
};

export const Collapse = CollapseComponent;

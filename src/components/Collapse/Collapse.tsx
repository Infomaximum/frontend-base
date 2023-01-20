import type { ICollapseProps } from "./Collapse.types";
import { Collapse as AntCollapse } from "antd";

const Collapse: React.FC<ICollapseProps> = (props) => {
  const { children, collapseStyle, ...rest } = props;

  return (
    <AntCollapse {...rest} css={collapseStyle}>
      {children}
    </AntCollapse>
  );
};

export default Collapse;

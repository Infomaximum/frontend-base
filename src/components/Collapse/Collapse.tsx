import type { ICollapseProps } from "./Collapse.types";
import { Collapse as AntCollapse } from "antd";
import { useTheme } from "../../decorators/hooks/useTheme";
import { getCssConversionStyle } from "../../styles";

const CollapseComponent: React.FC<ICollapseProps> = (props) => {
  const { children, collapseStyle, ...rest } = props;

  const theme = useTheme();

  return (
    <AntCollapse {...rest} css={getCssConversionStyle(theme, collapseStyle)}>
      {children}
    </AntCollapse>
  );
};

export const Collapse = CollapseComponent;

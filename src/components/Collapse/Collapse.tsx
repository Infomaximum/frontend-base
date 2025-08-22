import type { ICollapseProps } from "./Collapse.types";
import { Collapse as AntCollapse } from "antd";
import { useTheme } from "@infomaximum/base/src/decorators/hooks/useTheme";
import { getCssConversionStyle } from "@infomaximum/base/src/styles";

const CollapseComponent: React.FC<ICollapseProps> = (props) => {
  const { collapseStyle, ...rest } = props;

  const theme = useTheme();

  return <AntCollapse {...rest} css={getCssConversionStyle(theme, collapseStyle)} />;
};

export const Collapse = CollapseComponent;

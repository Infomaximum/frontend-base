import type { IPanelProps } from "./Panel.types";
import { Collapse } from "antd";
import { panelCollapseStyle } from "./Panel.styles";
import { useMemo } from "react";
import { useTheme } from "../../decorators/hooks/useTheme";
import { cssStyleConversion } from "../../styles";

const PanelComponent: React.FC<IPanelProps> = (props) => {
  const { panelStyle, testId, children, header, ...rest } = props;
  const theme = useTheme();

  const wrappedHeader = useMemo(() => {
    return <span test-id={testId}>{header}</span>;
  }, [header, testId]);

  return (
    <Collapse.Panel
      {...rest}
      header={wrappedHeader}
      css={cssStyleConversion(theme, [panelCollapseStyle, panelStyle])}
    >
      {children}
    </Collapse.Panel>
  );
};

export const Panel = PanelComponent;

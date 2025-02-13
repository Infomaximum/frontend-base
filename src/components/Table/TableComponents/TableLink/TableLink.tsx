import { type FC, isValidElement, memo, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { tableLinkStyle } from "./TableLink.styles";
import type { ITableLinkProps } from "./TableLink.types";
import { useTheme } from "../../../../decorators/hooks/useTheme";
import { AlignedTooltip } from "../../../AlignedTooltip";
import { Tag } from "../../../Tag";

const TableLinkComponent: FC<ITableLinkProps> = ({
  title,
  children,
  customTooltipWrapperStyle,
  ...restProps
}) => {
  const theme = useTheme();

  const disableTextOverflow = useCallback(() => {
    // Если внутри компонент Tag, то забледнение не требуется (у Tag свои стили забледнения) [PT-12198]
    return isValidElement(children) && children.type === Tag;
  }, [children]);

  const component = useMemo(
    () => (
      <Link css={tableLinkStyle(theme)} {...restProps}>
        {children}
      </Link>
    ),
    [theme, restProps, children]
  );

  if (disableTextOverflow()) {
    return component;
  }

  return (
    <AlignedTooltip title={title} customStyle={customTooltipWrapperStyle}>
      {component}
    </AlignedTooltip>
  );
};

export const TableLink = memo(TableLinkComponent);

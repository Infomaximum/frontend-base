import { type FC, isValidElement, memo, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { ellipsisStyle, tableLinkStyle } from "./TableLink.styles";
import type { ITableLinkProps } from "./TableLink.types";
import { useTheme } from "../../../../decorators/hooks/useTheme";
import { TextOverflow } from "../../../TextOverflow";
import { Tag } from "../../../Tag";

const TableLinkComponent: FC<ITableLinkProps> = ({
  ellipsis = true,
  title,
  children,
  ...restProps
}) => {
  const theme = useTheme();

  const styles = useMemo(
    () => [tableLinkStyle(theme), ellipsis ? ellipsisStyle : null],
    [ellipsis, theme]
  );

  const disableTextOverflow = useCallback(() => {
    // Если внутри компонент Tag, то забледнение не требуется (у Tag свои стили забледнения) [PT-12198]
    return isValidElement(children) && children.type === Tag;
  }, [children]);

  const component = useMemo(
    () => (
      <Link css={styles} {...restProps}>
        {children}
      </Link>
    ),
    [children, styles, restProps]
  );

  if (disableTextOverflow()) {
    return component;
  }

  return <TextOverflow title={title}>{component}</TextOverflow>;
};

export const TableLink = memo(TableLinkComponent);

import { cloneElement, type FC, isValidElement, memo, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { ellipsisStyle, tableLinkStyle } from "./TableLink.styles";
import type { ITableLinkProps } from "./TableLink.types";
import { Tooltip } from "../../../Tooltip/Tooltip";
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

  const clearTitle = useMemo(() => {
    /** Если это элемент, то нужно убрать некоторые стили которые были добавлены */
    if (isValidElement(title)) {
      return cloneElement(title, {
        css: null,
        style: null,
      } as any);
    }

    return title;
  }, [title]);

  const disableTextOverflow = useCallback(() => {
    // Если внутри компонент Tag, то забледнение не требуется (у Tag свои стили забледнения) [PT-12198]
    return isValidElement(children) && children.type === Tag;
  }, [children]);

  const component = useMemo(
    () => (
      <Link css={styles} {...restProps}>
        <Tooltip title={clearTitle}>{children}</Tooltip>
      </Link>
    ),
    [children, styles, clearTitle, restProps]
  );

  if (disableTextOverflow()) {
    return component;
  }

  return <TextOverflow>{component}</TextOverflow>;
};

export const TableLink = memo(TableLinkComponent);

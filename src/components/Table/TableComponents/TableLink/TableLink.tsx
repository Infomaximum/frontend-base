import { cloneElement, FC, isValidElement, memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { ellipsisStyle, tableLinkStyle } from "./TableLink.styles";
import type { ITableLinkProps } from "./TableLink.types";
import { Tooltip } from "../../../Tooltip/Tooltip";

const TableLinkComponent: FC<ITableLinkProps> = ({
  ellipsis = true,
  title,
  children,
  ...restProps
}) => {
  const styles = useMemo(
    () => [tableLinkStyle, ellipsis ? ellipsisStyle : null],
    [ellipsis]
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

  return (
    <Link css={styles} {...restProps}>
      <Tooltip title={clearTitle}>{children}</Tooltip>
    </Link>
  );
};

export const TableLink = memo(TableLinkComponent);

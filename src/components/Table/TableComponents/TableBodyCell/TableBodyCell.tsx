import { isArray, isString, last } from "lodash";
import React, { forwardRef } from "react";
import { tableBodyCellStyle } from "./TableBodyCell.styles";
import type { ITableBodyCellProps } from "./TableBodyCell.types";
import { useTheme } from "../../../../decorators/hooks/useTheme";
import { AlignedTooltip } from "../../../AlignedTooltip/AlignedTooltip";
import { getCssConversionStyle } from "../../../../styles";
import type { Interpolation } from "@emotion/react";

const TableBodyCellComponent: React.FC<ITableBodyCellProps> = forwardRef(
  (
    { children, showTooltip = false, style: cellCustomStyle, ...restProps },
    ref: React.Ref<HTMLTableCellElement>
  ) => {
    const theme = useTheme();

    const getTitle = () => {
      let title: string | null = null;

      /** В children ячейки таблицы приходит кортеж из двух элементов
       * в элемент с 0 индексом это иконка для раскрытия а элемент с индексом 1 это,
       *  элемент для отображения, его как раз и используем для title, только если это строка,
       * если это DOM элемент, то нужно по месту использования оборачивать в Tooltip
       */
      if (isArray(children)) {
        const lastChildren = last(children);

        if (isString(lastChildren)) {
          title = lastChildren;
        }
      } else if (isString(children)) {
        title = children;
      }

      return title;
    };

    return (
      <td
        {...restProps}
        css={getCssConversionStyle(theme, [
          tableBodyCellStyle,
          cellCustomStyle as Interpolation<TTheme> | undefined,
        ])}
        ref={ref}
        title={undefined}
      >
        {showTooltip ? <AlignedTooltip title={getTitle()}>{children}</AlignedTooltip> : children}
      </td>
    );
  }
);

export const TableBodyCell = TableBodyCellComponent;

import { forwardRef } from "react";
import type { ITableBodyRowProps } from "./TableBodyRow.types";
import { ContextMenuFloating } from "@infomaximum/base/src/components/ContextMenu";
import { RestModel } from "@infomaximum/base/src/models";

const TableBodyRowComponent: React.FC<ITableBodyRowProps> = forwardRef(
  (
    { children, record, isRowSelected, floatingContextMenuConfig, ...restProps },
    ref: React.Ref<HTMLTableRowElement>
  ) => {
    if (record?.model instanceof RestModel) {
      return (
        <tr {...restProps} ref={ref}>
          {children}
        </tr>
      );
    }

    return (
      <ContextMenuFloating
        data={record}
        isRowChecked={isRowSelected}
        floatingContextMenuConfig={floatingContextMenuConfig}
      >
        <tr {...restProps} ref={ref}>
          {children}
        </tr>
      </ContextMenuFloating>
    );
  }
);

export const TableBodyRow = TableBodyRowComponent;

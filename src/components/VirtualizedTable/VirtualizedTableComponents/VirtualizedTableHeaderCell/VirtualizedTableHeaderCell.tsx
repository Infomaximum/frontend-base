import { get, includes } from "lodash";
import { ESortDirection } from "../../../../utils/const";
import React, { memo, useMemo } from "react";
import type { IVirtualizedTableHeaderCellProps } from "./VirtualizedTableHeaderCell.types";
import { Row, Col } from "antd";
import { CaretDownOutlined, CaretUpOutlined } from "../../../Icons/Icons";
import { virtualizedTableDivTestId } from "../../../../utils/TestIds";
import { getVirtualizedTableCellFlexStyle } from "../VirtualizedTableBodyCell/VirtualizedTableBodyCell.styles";
import {
  sorterArrowDownActiveStyle,
  sorterArrowDownStyle,
  sorterArrowUpActiveStyle,
  sorterArrowUpStyle,
  sorterColumnStyle,
  virtualizedTableHeaderCellStyle,
  virtualizedTableHeaderSortedCellStyle,
  virtualizedTableHeaderSortedCellActiveStyle,
} from "./VirtualizedTableHeaderCell.styles";

const getSorterArrowStyle = (isUp: boolean, isActive: boolean) => {
  if (isUp) {
    return isActive ? sorterArrowUpActiveStyle : sorterArrowUpStyle;
  }

  return isActive ? sorterArrowDownActiveStyle : sorterArrowDownStyle;
};

const VirtualizedTableHeaderCellComponent = <T extends TDictionary>(
  props: IVirtualizedTableHeaderCellProps<T>
) => {
  const { column, onSorterChange, columnsOrders, isSorted, sortOrder } = props;
  const { key, title, width, sorter: isColumnSorter, minWidth } = column || {};

  const handleClick = useMemo(
    () => (isColumnSorter ? () => onSorterChange(column) : undefined),
    [column, isColumnSorter, onSorterChange]
  );

  const cellStyle = useMemo(() => {
    if (!isColumnSorter) {
      return virtualizedTableHeaderCellStyle;
    }

    return [
      virtualizedTableHeaderCellStyle,
      virtualizedTableHeaderSortedCellStyle,
      isSorted && sortOrder && virtualizedTableHeaderSortedCellActiveStyle,
    ];
  }, [isColumnSorter, isSorted, sortOrder]);

  const getSorterButton = () => {
    const isUpActive = isSorted && sortOrder === ESortDirection.ASC;
    const isDownActive = isSorted && sortOrder === ESortDirection.DESC;

    const columnOrders = key ? get(columnsOrders, key) : undefined;

    return (
      <Row key="sortable" align="middle">
        <Col css={sorterColumnStyle}>
          {includes(columnOrders, ESortDirection.ASC) && (
            <Row key="asc">
              <CaretUpOutlined css={getSorterArrowStyle(true, isUpActive)} />
            </Row>
          )}
          {includes(columnOrders, ESortDirection.DESC) && (
            <Row key="desc">
              <CaretDownOutlined
                css={getSorterArrowStyle(false, isDownActive)}
              />
            </Row>
          )}
        </Col>
      </Row>
    );
  };

  return (
    <div
      css={cellStyle}
      style={getVirtualizedTableCellFlexStyle(width, minWidth)}
      onClick={handleClick}
      test-id={virtualizedTableDivTestId}
    >
      <>
        {title}
        {isColumnSorter && getSorterButton()}
      </>
    </div>
  );
};

const MemoVirtualizedTableHeaderCell = memo(
  VirtualizedTableHeaderCellComponent
);

export const VirtualizedTableHeaderCell = <T extends TDictionary>(
  props: IVirtualizedTableHeaderCellProps<T>
) => <MemoVirtualizedTableHeaderCell {...props} />;

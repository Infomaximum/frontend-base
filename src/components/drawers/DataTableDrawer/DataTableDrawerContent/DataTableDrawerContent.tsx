import React, { useCallback, useMemo } from "react";
import type { IDataTableDrawerContentProps } from "./DataTableDrawerContent.types";
import { ALL, EMPTY_STRING } from "../../../../utils/Localization/Localization";
import { isFunction, isUndefined } from "lodash";
import { tableStyle } from "./DataTableDrawerContent.styles";
import { observer } from "mobx-react";
import { renderErrorAlert } from "./DataTableDrawerContent.utils";
import { type IModel } from "@infomaximum/graphql-model";
import { useLocalization } from "../../../../decorators/hooks/useLocalization";
import { DataTable, LoadingOnScrollDataTable } from "../../../DataTable/DataTable";
import { ELimitsStateNames } from "../../../../utils/const";
import { AlignedTooltip } from "../../../AlignedTooltip";
import type { TBaseRow } from "../../../../managers/Tree";
import { PagingGroup } from "../../../../models";
import { type TableStore } from "../../../../utils";
import { useMountEffect } from "../../../../decorators";
import { Spinner } from "../../../Spinner";

const DataTableDrawerContentComponent = <T extends TBaseRow>({
  handlerTableDisplayValues,
  rowBuilder: propsRowBuilder,
  columns,
  headerMode,
  isVirtualized,
  isLoadingOnScroll,
  requestOnMount = true,
  ...restProps
}: IDataTableDrawerContentProps<T>) => {
  const { tableStore } = restProps;

  const localization = useLocalization();

  // При монтировании запрашиваем данные (взято из DataTable, туда передается false)
  useMountEffect(() => {
    const { queryVariables, tableStore } = restProps;

    requestOnMount &&
      tableStore.requestData({
        variables: queryVariables,
      });
  });

  const columnConfig = useMemo(
    () =>
      columns ?? [
        {
          key: "name",
          dataIndex: "name",
          title: localization.getLocalized(ALL),
          ellipsis: true,
          render: (text) => <AlignedTooltip>{text}</AlignedTooltip>,
        },
      ],
    [localization, columns]
  );

  const rowBuilder = useCallback(
    (model: IModel): any => {
      if (isFunction(propsRowBuilder)) {
        return propsRowBuilder(model);
      }

      let name = model.getDisplayName?.() || localization.getLocalized(EMPTY_STRING);

      if (isFunction(handlerTableDisplayValues)) {
        const value = handlerTableDisplayValues(model);

        if (value) {
          name = value;
        }
      }

      return {
        model,
        name,
        id: model.getId(),
        key: model.getInnerName(),
      };
    },
    [localization, propsRowBuilder, handlerTableDisplayValues]
  );

  if (!tableStore.model) {
    return <Spinner />;
  }

  const isNeedLoadingOnScrollDataTable =
    (isUndefined(isLoadingOnScroll) && tableStore?.model instanceof PagingGroup) ||
    isLoadingOnScroll;

  const TableComponent = isNeedLoadingOnScrollDataTable ? LoadingOnScrollDataTable : DataTable;

  return (
    <>
      {tableStore.error && renderErrorAlert(tableStore.error, localization)}

      <TableComponent
        {...restProps}
        key="data-table-field-drawer"
        rowBuilder={rowBuilder}
        columns={columnConfig}
        limitStateName={ELimitsStateNames.GROUP_SETTINGS}
        css={tableStyle}
        isVirtualized={isVirtualized ?? true}
        headerMode={headerMode}
        clearOnUnmount={true}
        enableRowClick={true}
        isShowDividers={tableStore.isTree || columnConfig.length > 1}
        tableStore={tableStore as TableStore<PagingGroup>}
        requestOnMount={false}
        isWithoutWrapperStyles={true}
      />
    </>
  );
};

const DataTableDrawerContent = observer(DataTableDrawerContentComponent);

export { DataTableDrawerContent };

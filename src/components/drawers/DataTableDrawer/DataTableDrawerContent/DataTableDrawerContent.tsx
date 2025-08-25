import React, { useCallback, useMemo } from "react";
import type { IDataTableDrawerContentProps } from "./DataTableDrawerContent.types";
import { ALL, EMPTY_STRING } from "@infomaximum/base/src/utils/Localization/Localization";
import { isEmpty, isFunction, isUndefined } from "lodash";
import { tableStyle } from "./DataTableDrawerContent.styles";
import { observer } from "mobx-react";
import { renderErrorAlert } from "./DataTableDrawerContent.utils";
import { type IModel } from "@infomaximum/graphql-model";
import { useLocalization } from "@infomaximum/base/src/decorators/hooks/useLocalization";
import {
  DataTable,
  LoadingOnScrollDataTable,
} from "@infomaximum/base/src/components/DataTable/DataTable";
import { ELimitsStateNames } from "@infomaximum/base/src/utils/const";
import { AlignedTooltip } from "@infomaximum/base/src/components/AlignedTooltip";
import type { TBaseRow } from "@infomaximum/base/src/managers/Tree";
import { PagingGroup } from "@infomaximum/base/src/models";
import { type TableStore } from "@infomaximum/base/src/utils";
import { useMountEffect } from "@infomaximum/base/src/decorators/hooks/useMountEffect";
import { GlobalSpinner } from "@infomaximum/base/src/components/Spinner/GlobalSpinner/GlobalSpinner";

const DataTableDrawerContentComponent = <T extends TBaseRow>({
  handlerTableDisplayValues,
  rowBuilder: propsRowBuilder,
  columns,
  headerMode,
  isVirtualized,
  isLoadingOnScroll,
  requestOnMount = true,
  isShowDividers,
  ...restProps
}: IDataTableDrawerContentProps<T>) => {
  const { tableStore } = restProps;

  const localization = useLocalization();

  // При монтировании запрашиваем данные (взято из DataTable, туда передается false)
  useMountEffect(() => {
    const { queryVariables, tableStore, defaultCheckedModels } = restProps;

    if (requestOnMount) {
      // код из DataTable, для установки topRows при первом запросе
      if (!isUndefined(defaultCheckedModels) && !isEmpty(defaultCheckedModels)) {
        tableStore.setTopRowsModels(defaultCheckedModels);
      }

      const checkedModels = defaultCheckedModels || tableStore.checkedState.accumulatedModels;

      // для работы always_coming_data при первом запросе
      if (checkedModels) {
        tableStore.setCheckState({
          accumulatedModels: checkedModels,
          models: checkedModels,
        });
      }

      tableStore.requestData({
        variables: queryVariables,
      });
    }
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
    return tableStore.error ? renderErrorAlert(tableStore.error, localization) : <GlobalSpinner />;
  }

  const isNeedLoadingOnScrollDataTable =
    (isUndefined(isLoadingOnScroll) && tableStore.model instanceof PagingGroup) ||
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
        isShowDividers={isShowDividers ?? (tableStore.isTree || columnConfig.length > 1)}
        tableStore={tableStore as TableStore<PagingGroup>}
        requestOnMount={false}
        isWithoutWrapperStyles={true}
      />
    </>
  );
};

const DataTableDrawerContent = observer(DataTableDrawerContentComponent);

export { DataTableDrawerContent };

import React, { useCallback, useMemo } from "react";
import type { IDataTableDrawerContentProps } from "./DataTableDrawerContent.types";
import { ALL, EMPTY_STRING } from "../../../../utils/Localization/Localization";
import { isFunction } from "lodash";
import { tableStyle } from "./DataTableDrawerContent.styles";
import { observer } from "mobx-react";
import { renderErrorAlert } from "./DataTableDrawerContent.utils";
import type { IModel } from "@infomaximum/graphql-model";
import { useLocalization } from "../../../../decorators/hooks/useLocalization";
import { DataTable } from "../../../DataTable/DataTable";
import { ELimitsStateNames } from "../../../../utils/const";
import { TextOverflow } from "../../../TextOverflow";

const DataTableDrawerContentComponent: React.FC<IDataTableDrawerContentProps> = ({
  handlerTableDisplayValues,
  rowBuilder: propsRowBuilder,
  columns,
  headerMode,
  isVirtualized,
  ...restProps
}) => {
  const { tableStore } = restProps;

  const localization = useLocalization();

  const columnConfig = useMemo(
    () =>
      columns ?? [
        {
          key: "name",
          dataIndex: "name",
          title: localization.getLocalized(ALL),
          ellipsis: true,
          render: (text) => <TextOverflow isRelative={false}>{text}</TextOverflow>,
        },
      ],
    [localization, columns]
  );

  const rowBuilder = useCallback(
    (model: IModel) => {
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

  return (
    <>
      {tableStore.error && renderErrorAlert(tableStore.error, localization)}
      <DataTable
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
      />
    </>
  );
};

const DataTableDrawerContent = observer(DataTableDrawerContentComponent);

export { DataTableDrawerContent };

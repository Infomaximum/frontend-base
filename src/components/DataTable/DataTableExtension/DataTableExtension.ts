import type { Localization } from "@im/localization";
import type { IModel } from "@im/models";
import type { GraphQlQuery, TFeatureEnabledChecker } from "@im/utils";
import { assignIn, isNil, isFunction } from "lodash";
import type { IColumnProps } from "../../VirtualizedTable/VirtualizedTable.types";
import type {
  IDataTableExtension,
  TDataSourceExt,
  TQueryExtension,
  TRowExt,
} from "./DataTableExtension.types";

class DataTableExtension implements IDataTableExtension {
  private columnConfigExtension: Set<TRowExt> = new Set();
  private queryExtensions: Set<TQueryExtension> = new Set();
  private queryVariableExtensions: Set<TQueryVarModifierExt> = new Set();
  private dataSourceExtension: Set<TDataSourceExt> = new Set();

  protected constructor() {}

  public addColumnConfigExtension(rowExtend: TRowExt): void {
    this.columnConfigExtension.add(rowExtend);
  }

  public addQueryExtension(queryExtension: TQueryExtension): void {
    this.queryExtensions.add(queryExtension);
  }

  public addDataSourceExtension(dataExtension: TDataSourceExt): void {
    this.dataSourceExtension.add(dataExtension);
  }

  public addQueryVariableExtension(
    queryVariableExtension: TQueryVarModifierExt
  ): void {
    this.queryVariableExtensions.add(queryVariableExtension);
  }

  public extendRow<T>(
    baseRow: T,
    model: IModel,
    localization: Localization,
    isFeatureEnabled: TFeatureEnabledChecker | undefined
  ): void {
    this.dataSourceExtension.forEach((extension) => {
      assignIn(baseRow, extension(model, localization, isFeatureEnabled));
    });
  }

  public extendColumnConfig<T = unknown>(
    baseConfig: IColumnProps<T>[],
    localization: Localization,
    isFeatureEnabled: TFeatureEnabledChecker | undefined
  ): void {
    this.columnConfigExtension.forEach((columnExtensionGetter) => {
      const columnExtension = columnExtensionGetter(
        localization,
        isFeatureEnabled
      );

      if (!isNil(columnExtension)) {
        baseConfig.push(columnExtension);
      }
    });
  }

  public extendQuery(baseQuery: GraphQlQuery): void {
    this.queryExtensions.forEach((extension) => {
      if (isFunction(extension)) {
        extension(baseQuery);
      }
    });
  }

  public extendQueryVariable(
    variables: TDictionary,
    queryParams: { store: unknown }
  ): void {
    this.queryVariableExtensions.forEach((extension) => {
      if (isFunction(extension)) {
        extension(variables, queryParams);
      }
    });
  }
}

export { DataTableExtension };

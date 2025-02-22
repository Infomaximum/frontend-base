import type { Localization } from "@infomaximum/localization";
import type { IModel, Model } from "@infomaximum/graphql-model";
import type { GraphQlQuery, TFeatureEnabledChecker } from "@infomaximum/utility";
import { assignIn, isNil, isFunction } from "lodash";
import type { IColumnProps } from "../../VirtualizedTable/VirtualizedTable.types";
import type {
  IDataTableExtension,
  TDataSourceExt,
  TQueryExtension,
  TRowExt,
} from "./DataTableExtension.types";
import type { Store } from "../../../utils";

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

  public addQueryVariableExtension(queryVariableExtension: TQueryVarModifierExt): void {
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

  public extendColumnConfig<T = any>(
    baseConfig: IColumnProps<T>[],
    localization: Localization,
    isFeatureEnabled: TFeatureEnabledChecker | undefined
  ): void {
    this.columnConfigExtension.forEach((columnExtensionGetter) => {
      const columnExtension = columnExtensionGetter(localization, isFeatureEnabled);

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

  public extendQueryVariable(variables: TDictionary, queryParams: { store: Store<Model> }): void {
    this.queryVariableExtensions.forEach((extension) => {
      if (isFunction(extension)) {
        extension(variables, queryParams);
      }
    });
  }
}

export { DataTableExtension };

import type { Localization } from "@im/localization";
import type { IModel } from "@im/models";
import type { GraphQlQuery, TFeatureEnabledChecker } from "@im/utils";
import type { IColumnProps } from "../../VirtualizedTable/VirtualizedTable.types";

export type TDataSourceExt<T extends { [key: string]: any } = TDictionary> = (
  model: IModel,
  localization?: Localization,
  isFeatureEnabled?: TFeatureEnabledChecker
) => T | undefined;

export type TRowExt<T = unknown> = (
  localization?: Localization,
  isFeatureEnabled?: TFeatureEnabledChecker
) => IColumnProps<T> | undefined;

export type TQueryExtension = (targetQuery: GraphQlQuery) => void;

export interface IDataTableExtension {
  addColumnConfigExtension<T = unknown>(rowExtend: TRowExt<T>): void;
  addQueryExtension(queryExtension: TQueryExtension): void;
  addDataSourceExtension(dataExtension: TDataSourceExt): void;
  extendQuery(baseQuery: GraphQlQuery): void;
  addQueryVariableExtension(variable: TQueryVarModifierExt): void;
  extendColumnConfig<T = unknown>(
    baseConfig: IColumnProps<T>[],
    localization?: Localization,
    isFeatureEnabled?: TFeatureEnabledChecker
  ): void;
  extendRow<T = { [key: string]: any }>(
    baseRow: T,
    model: IModel,
    localization?: Localization,
    isFeatureEnabled?: TFeatureEnabledChecker
  ): void;
  extendQueryVariable(variables: TDictionary, queryParams: { store: unknown }): void;
}

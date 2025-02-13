import type { Localization } from "@infomaximum/localization";
import type { IModel } from "@infomaximum/graphql-model";
import type { GraphQlQuery, TFeatureEnabledChecker } from "@infomaximum/utility";
import type { IColumnProps } from "../../VirtualizedTable/VirtualizedTable.types";

export type TDataSourceExt<T extends { [key: string]: any } = TDictionary> = (
  model: IModel,
  localization?: Localization,
  isFeatureEnabled?: TFeatureEnabledChecker
) => T | undefined;

export type TRowExt<T = any> = (
  localization?: Localization,
  isFeatureEnabled?: TFeatureEnabledChecker
) => IColumnProps<T> | undefined;

export type TQueryExtension = (targetQuery: GraphQlQuery) => void;

export interface IDataTableExtension {
  addColumnConfigExtension<T = any>(rowExtend: TRowExt<T>): void;
  addQueryExtension(queryExtension: TQueryExtension): void;
  addDataSourceExtension(dataExtension: TDataSourceExt): void;
  extendQuery(baseQuery: GraphQlQuery): void;
  addQueryVariableExtension(variable: TQueryVarModifierExt): void;
  extendColumnConfig<T = any>(
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

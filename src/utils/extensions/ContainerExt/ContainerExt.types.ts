import type { GraphQlQuery } from "@infomaximum/utility";
import type { NStore } from "../../Store/Store/Store.types";

export type TFormElementsGetter<P = unknown> = (props: P) => React.ReactNode[];

export type TFormElementsGetterList<P = unknown> = TFormElementsGetter<P>[];

export type TInitialValuesModifier<P = unknown> = (
  initialValues: TDictionary,
  containerProps?: P
) => void;

export type TInitialValuesModifierList<P = unknown> = TInitialValuesModifier<P>[];

export type TQueryBuilderModifier = (
  queryBuilder: GraphQlQuery,
  queryGetterParams?: NStore.TQueryGetterParams
) => void;

export type TQueryBuilderModifierList = TQueryBuilderModifier[];

export type TVariablesValuesModifier<P = unknown> = (
  variablesValues: TDictionary,
  formValues?: TDictionary,
  containerProps?: P
) => void;

export type TMutationConfig<P = unknown> = {
  mutations?: string;
  variableNames?: string;
  modifyVariablesValues?: TVariablesValuesModifier<P>;
};

export type TMutationConfigGetter<P = unknown> = {
  mutations?: (params: P) => string;
  variableNames?: (params: P) => string;
  modifyVariablesValues?: TVariablesValuesModifier<P>;
};

export type TLoadingGetter = () => boolean;

export type TMountHandler = () => void;

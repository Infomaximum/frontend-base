import type React from "react";
import type {
  TFormElementsGetter,
  TFormElementsGetterList,
  TInitialValuesModifierList,
  TQueryBuilderModifierList,
  TInitialValuesModifier,
  TQueryBuilderModifier,
  TMutationConfig,
  TMutationConfigGetter,
} from "./ContainerExt.types";
import { forEach } from "lodash";
import type { GraphQlQuery } from "@infomaximum/utility";
import type { NStore } from "../../Store/Store/Store.types";

export class ContainerExt<P = unknown> {
  private formElementsGetterList: TFormElementsGetterList<P> = [];
  private initialValuesModifierList: TInitialValuesModifierList<P> = [];
  private queryBuilderModifierList: TQueryBuilderModifierList = [];
  private mutationConfigCallbackList: TMutationConfigGetter[] = [];

  constructor() {
    this.modifyVariablesValues = this.modifyVariablesValues.bind(this);
  }

  /**
   * Возвращает компоненты формы. Сортировка элементов осуществляется компонентом Form,
   * через сортировку элементов со свойством priority.
   * @param containerProps - свойства контейнера
   */
  public getFormElements(containerProps: P) {
    const formElements: React.ReactNode[] = [];

    forEach(this.formElementsGetterList, (formElementsGetter) => {
      formElements.push(...formElementsGetter(containerProps));
    });

    return formElements;
  }

  /**
   * Добавляет геттер компонентов формы в список
   * @param formElementsGetter - геттер компонентов формы
   */
  public pushFormElementsGetter(formElementsGetter: TFormElementsGetter<P>): void {
    this.formElementsGetterList.push(formElementsGetter);
  }

  /**
   * Модифицирует начальные данные формы
   * @param initialValues - текущие начальные данные формы
   * @param containerProps - свойства контейнера
   */
  public modifyInitialValues(initialValues: TDictionary, containerProps: P) {
    forEach(this.initialValuesModifierList, (initialValuesModifier) => {
      initialValuesModifier(initialValues, containerProps);
    });
  }

  /**
   * Добавляет модификатор начальных данных формы в список
   * @param initialValuesModifier - модификатор начальных данных формы
   */
  public pushInitialValuesModifier(initialValuesModifier: TInitialValuesModifier): void {
    this.initialValuesModifierList.push(initialValuesModifier);
  }

  /**
   * Модифицирует queryBuilder запроса контейнера
   * @param queryBuilder - queryBuilder запроса
   * @param queryGetterParams - параметры геттера запроса
   */
  public modifyQueryBuilder(
    queryBuilder: GraphQlQuery,
    queryGetterParams?: NStore.TQueryGetterParams
  ) {
    forEach(this.queryBuilderModifierList, (queryBuilderModifier) => {
      queryBuilderModifier(queryBuilder, queryGetterParams);
    });
  }

  /**
   * Добавляет модификатор queryBuilder запроса контейнера в список
   * @param queryBuilderModifier - модификатор queryBuilder
   */
  public pushQueryBuilderModifier(queryBuilderModifier: TQueryBuilderModifier): void {
    this.queryBuilderModifierList.push(queryBuilderModifier);
  }

  /**
   * Изменить значения для мутации
   * @param variables - переменные для мутации
   * @param formValues - значения формы
   * @param containerProps - свойства контейнера
   */
  private modifyVariablesValues(
    variables: TDictionary,
    formValues?: TDictionary,
    containerProps?: P
  ): void {
    forEach(this.mutationConfigCallbackList, (config) => {
      config.modifyVariablesValues?.(variables, formValues, containerProps);
    });
  }

  /**
   * Получить конфигурацию для изменения мутации
   */
  public getMutationsConfig(containerProps?: P): TMutationConfig<P> {
    const mutationConfig = {
      mutations: "",
      variableNames: "",
      modifyVariablesValues: this.modifyVariablesValues,
    };

    forEach(this.mutationConfigCallbackList, (config) => {
      const mutation = config.mutations?.(containerProps);
      const variableName = config.variableNames?.(containerProps);
      mutationConfig.mutations = mutationConfig.mutations.concat(mutation || "");
      mutationConfig.variableNames = mutationConfig.variableNames.concat(variableName || "");
    });

    return mutationConfig;
  }

  public pushMutationConfigGetter(mutationConfigGetter: TMutationConfigGetter<P>) {
    this.mutationConfigCallbackList.push(mutationConfigGetter);
  }
}

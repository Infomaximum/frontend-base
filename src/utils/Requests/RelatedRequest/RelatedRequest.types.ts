import type { DocumentNode } from "@apollo/client";

export type TChainedQueryParams = {
  /**
   * Запрос
   */
  query: DocumentNode;
  /**
   * Мутация
   */
  mutation?: DocumentNode;
  /**
   * Переменные для запроса
   */
  variables?: TDictionary;
  /**
   * Пропустить ли выполнение данного запроса?
   */
  skipThis?: boolean;
  formData?: any;
  files?: any;
  callBackUpload?: any;
};

/**
 * Параметры для getQueryParams в цепочке запросов
 */
export type TChainedQueryGetterParams = {
  /**
   * Скомбинированный ответ предыдущих запросов
   */
  prevResponse: any;
};

export type TRelatedQuery = {
  /**
   * Формирует параметры для запроса, имеет доступ к предыдущему скомбинированному ответу
   */
  getQueryParams: (config: TChainedQueryGetterParams) => TChainedQueryParams;
  /**
   * Комбинирует предыдущий ответ с текущим и возвращает скомбинированный ответ.
   */
  responseCombiner: (prevResponse: any, thisResponse: any) => any;
};

/**
 * Результат getQueryParams если используем цепочку запросов
 */
export type TRelatedRequestData = {
  /**
   * Описание связанных запросов.
   * Если есть описание то, описанные запросы будут иметь один комбинированный ответ
   */
  relatedQueries: TRelatedQuery[];
};

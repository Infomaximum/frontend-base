import { useState, useCallback, useRef } from "react";
import type { DocumentNode } from "@apollo/client";
import { useUnmountEffect } from "../../decorators";
import type { TCancelableRequest } from "../../services/Network/Requests.types";
import { BaseRequestService } from "../../services/Network/BaseRequestService";

interface ILazyQueryParams {
  /** Запрос */
  query: DocumentNode;
  /** Переменные запроса */
  variables?: TDictionary | undefined;
  cancelable?: TCancelableRequest;
}

export type TLazyQuery = ({
  query,
  variables,
  ...rest
}: ILazyQueryParams) => Promise<TDictionary | null>;

/** Хук для выполнения запроса без привязки с какому либо хранилищу.
 *
 * Когда использовать?: Во многих местах системы у нас используется requestData из какого-либо стора,
 * например профилирующего, с подмененным запросом без сохранения данных (query - параметр в вызове requestData).
 * При этом мех-мы статусов хранилища так же отрабатывают при выполнении запроса, что вызывает проблемы.
 *
 * @example
 * Было:
 *   const response = await workspaceCommonStore.requestData({
 *         query: isConnectionActiveQuery,
 *         variables: { id: model.getId() },
 *   });
 *
 *   setIsCHConnectionActive(get(response, "workspace.workspace.connection_active"));
 *
 * Стало:
 *   const [lazyQuery, { isLoading }] = useLazyQuery();
 *
 *   const response = await lazyQuery({
 *         query: isConnectionActiveQuery,
 *         variables: { id: model.getId() },
 *   });
 *
 *   setIsCHConnectionActive(get(response, "workspace.workspace.connection_active"));
 */
export const useLazyQuery = () => {
  const [isLoading, setLoading] = useState(false);
  const [request] = useState(() => new BaseRequestService());
  const counterRef = useRef(0);

  useUnmountEffect(() => {
    setLoading(false);
  });

  const lazyQuery = useCallback<TLazyQuery>(
    async ({ query, variables, ...rest }: ILazyQueryParams): Promise<TDictionary | null> => {
      setLoading(true);

      counterRef.current += 1;

      try {
        return await request.requestData({
          query: query as DocumentNode,
          variables,
          cancelable: rest?.cancelable ?? false,
          additionalParams: rest,
        });
      } catch (error) {
        throw error;
      } finally {
        counterRef.current -= 1;

        !counterRef.current && setLoading(false);
      }
    },
    [request]
  );

  return [lazyQuery, { isLoading }] as const;
};

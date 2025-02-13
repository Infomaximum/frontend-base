import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { WebSocketPingPongInterval, WebSocketConnectionRetryInterval } from "../const";
import { getCurrentHostWithoutProtocol, isHttps } from "../URI/URI";

export function createWebSocketLink() {
  const wsProtocol = isHttps() ? "wss:" : "ws:";

  const url = `${wsProtocol}//${getCurrentHostWithoutProtocol()}ws`;

  const subscriptionClient = createClient({
    url,
    keepAlive: WebSocketPingPongInterval,
    lazy: true,
    retryAttempts: Infinity,
    shouldRetry: () => true,
    retryWait: () =>
      new Promise((res) => {
        setTimeout(res, WebSocketConnectionRetryInterval);
      }),
    /* Обработчик нужен для того, чтобы Apollo корректно отследил ошибку.
    Согласно стандарту, ошибка в подписке, должна содержать поле "message".
    https://spec.graphql.org/October2021/#sec-Errors.Error-result-format

    todo: убрать после реализации на сервере задачи https://jira.office.infomaximum.com/browse/PT-14768
    задача https://jira.office.infomaximum.com/browse/PT-14771 */
    jsonMessageReviver: (key, value) => {
      if (!key && value?.type === "error" && Array.isArray(value?.payload)) {
        value.payload.forEach((payloadValue: any) => {
          if (payloadValue?.code && !payloadValue.message) {
            payloadValue.message = payloadValue.code;
          }
        });
      }

      return value;
    },
  });

  return {
    webSocketLink: new GraphQLWsLink(subscriptionClient),
    subscriptionClient,
  };
}

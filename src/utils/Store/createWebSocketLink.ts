import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { WebSocketPingPongInterval, WebSocketConnectionRetryInterval } from "../const";
import { getCurrentHostWithoutProtocol, isHttps } from "../URI/URI";
import { snakeCase } from "lodash";
import { MillisecondsPerSecond, XTraceIdHeaderKey } from "@infomaximum/utility";
import { v4 as uuid4 } from "uuid";

export function createWebSocketLink() {
  const wsProtocol = isHttps() ? "wss:" : "ws:";

  const url = `${wsProtocol}//${getCurrentHostWithoutProtocol()}ws`;

  const xTraceIdKey = snakeCase(XTraceIdHeaderKey);
  let timedOut: NodeJS.Timer;

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
    connectionParams: () => ({
      [xTraceIdKey]: uuid4(),
    }),
    on: {
      // https://the-guild.dev/graphql/ws/recipes#client-usage-with-abrupt-termination-on-pong-timeout
      ping: (received) => {
        if (!received) {
          timedOut = setTimeout(
            subscriptionClient.terminate,
            WebSocketPingPongInterval - 2 * MillisecondsPerSecond
          );
        }
      },
      pong: (received) => {
        if (received) {
          clearTimeout(timedOut);
        }
      },
    },
  });

  return {
    webSocketLink: new GraphQLWsLink(subscriptionClient),
    subscriptionClient,
  };
}

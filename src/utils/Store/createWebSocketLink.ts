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
  });

  return {
    webSocketLink: new GraphQLWsLink(subscriptionClient),
    subscriptionClient,
  };
}

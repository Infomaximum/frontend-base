import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { WebSocketPingPongInterval } from "../const";
import { getCurrentHostWithoutProtocol, isHttps } from "../URI/URI";

export function createWebSocketLink() {
  let wsProtocol = "ws:";
  if (isHttps()) {
    wsProtocol = "wss:";
  }

  const url = `${wsProtocol}//${getCurrentHostWithoutProtocol()}ws`;

  const subscriptionClient = createClient({
    url,
    keepAlive: WebSocketPingPongInterval,
    lazy: true,
  });

  return {
    webSocketLink: new GraphQLWsLink(subscriptionClient),
    subscriptionClient,
  };
}

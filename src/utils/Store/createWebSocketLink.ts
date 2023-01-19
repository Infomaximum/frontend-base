import { getCurrentHostWithoutProtocol } from "@im/utils";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { WebSocketPingPongInterval } from "../const";

function createWebSocketLink() {
  let wsProtocol = "ws:";
  if (window.location.protocol === "https:") {
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

export default createWebSocketLink;

import type { ApolloLink } from "@apollo/client";
import type { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import type { Client } from "graphql-ws";

export type TApolloLinks = {
  webSocketLink: GraphQLWsLink;
  subscriptionClient: Client;
  uploadLink: ApolloLink;
};

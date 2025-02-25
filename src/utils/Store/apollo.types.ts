import type { ApolloLink } from "@apollo/client";
import type { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import type { AxiosRequestConfig } from "axios";
import type { Client } from "graphql-ws";

export type TApolloLinks = {
  webSocketLink: GraphQLWsLink;
  subscriptionClient: Client;
  uploadLink: ApolloLink;
};

export type TModifyUploadLinkAxiosConfig = (config: AxiosRequestConfig) => AxiosRequestConfig;

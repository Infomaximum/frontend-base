import type { DocumentNode, NextLink, Operation, NormalizedCacheObject } from "@apollo/client";
import { ApolloClient, ApolloLink, InMemoryCache, split } from "@apollo/client";
import type { OperationDefinitionNode } from "graphql";
import type { TApolloLinks } from "./apollo.types";
import createUploadLink from "./createUploadLink";
import createWebSocketLink from "./createWebSocketLink";

class Apollo {
  public apolloClient!: ApolloClient<NormalizedCacheObject>;
  public apolloLinks: TApolloLinks | undefined = undefined;
  private sessionHash!: string;

  private getAfterwareLink(graphqlURL: string) {
    return new ApolloLink((operation: Operation, forward?: NextLink) => {
      if (process.env.NODE_ENV === "development") {
        const operationType =
          (operation.query.definitions[0] as OperationDefinitionNode).operation || "";
        const operationName = operation.operationName || "no_name";

        operation.setContext(() => {
          return { uri: `${graphqlURL}?___${operationType}_${operationName}` };
        });
      }

      if (forward) {
        return forward(operation).map((response) => {
          const context = operation.getContext();
          const {
            response: { headers },
          } = context;

          if (headers) {
            const networkHash: string = headers.get("Revalidate-Hash");

            if (!this.sessionHash) {
              this.sessionHash = networkHash;
            } else {
              if (this.sessionHash !== networkHash) {
                /**
                 * если сборка фронтенд запущен в development режиме, то вместо перезагрузки стоит
                 * просто писать в консоль варнинги с требованием обновления страница, поскольку
                 * разрабочик может дебажить код и перезагрузка будет ему мешать
                 */
                if (process.env.NODE_ENV !== "production") {
                  // eslint-disable-next-line no-console
                  console.warn(
                    "%cХэш системы изменился, необходимо обновить страницу!",
                    "font-size:16px;"
                  );
                } else {
                  window.location.reload();
                }
              }
            }
          }

          return response;
        });
      }

      return null;
    });
  }

  private createApolloClient(link: ApolloLink) {
    this.apolloClient = new ApolloClient({
      link,
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: "no-cache",
          errorPolicy: "ignore",
        },
        query: {
          fetchPolicy: "no-cache",
          errorPolicy: "all",
        },
      },
      connectToDevTools: process.env.NODE_ENV !== "production",
      queryDeduplication: false,
    });

    return this.apolloClient;
  }

  public createClient(graphqlURL: string) {
    try {
      // работа с http-заголовками ответа сервера
      const afterwareLink = this.getAfterwareLink(graphqlURL);

      const hasSubscriptionOperation = ({ query: { definitions } }: { query: DocumentNode }) =>
        definitions.some(
          (v) => v.kind === "OperationDefinition" && v?.operation === "subscription"
        );

      const uploadLink = createUploadLink(graphqlURL);
      const { webSocketLink, subscriptionClient } = createWebSocketLink();

      const link = split(hasSubscriptionOperation, webSocketLink, afterwareLink.concat(uploadLink));

      this.apolloLinks = {
        webSocketLink,
        subscriptionClient,
        uploadLink,
      };

      this.createApolloClient(link);
    } catch (error) {
      throw error;
    }
  }
}

export const apolloInstance = new Apollo();

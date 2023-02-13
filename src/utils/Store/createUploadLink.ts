import { forEach } from "lodash";
import {
  ApolloLink,
  Observable,
  selectURI,
  selectHttpOptionsAndBody,
  fallbackHttpConfig,
  createSignalIfSupported,
  parseAndCheckHttpResponse,
} from "@apollo/client";
import type { AxiosResponse, AxiosRequestConfig } from "axios";
import axios from "axios";
import {
  CancelRequest,
  EHttpCodes,
  NetworkFailResendAttemptsCount,
  ResendDelays,
} from "@im/utils";
import axiosRetry from "axios-retry";

/**
 * Перехватчики событий ответа/запроса, которые изменяют глобальную переменную activeRequests, в
 * которой хранится количество активных в данный момент запросов.
 *
 * Выбор на такой способ обработки пал из-за, того, что это нужно для интеграционных тестов, в
 * которых, для контроля количества активных запросов использовалась библиотека jQuery, в которой
 * подсчёт вёлся точно таким же способом.
 */
axios.interceptors.request.use(
  (config) => {
    window.activeRequests += 1;
    return config;
  },
  (error) => {
    window.activeRequests -= 1;
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    window.activeRequests -= 1;
    return response;
  },
  (error) => {
    window.activeRequests -= 1;
    return Promise.reject(error);
  }
);

axiosRetry(axios, {
  retries: NetworkFailResendAttemptsCount,
  retryDelay: (retryCount) => {
    return ResendDelays[retryCount - 1] ?? 0;
  },
  retryCondition: (error) => {
    const errorStatusCode = error.response?.status;
    // Повторно отправляем запрос только в том случае, если пришла ошибка без
    // статус-кода (нет соединения) или со статус-кодом 502 или 504
    return (
      !errorStatusCode ||
      errorStatusCode === EHttpCodes.BAD_GATEWAY ||
      errorStatusCode === EHttpCodes.GATEWAY_TIMEOUT
    );
  },
});

/**
 * Прокси-функция, превращающая ответ сервера из формата библиотеки Axios в формат функции fetch.
 * Существует только из-за того, что в проекте требуются возможность слежения за прогрессом загрузки
 * файла на сервер, возможность отмены загрузки файла на сервер и что ApolloClient не может работать
 * с Axios.
 * @param response - ответ от сервера в формате библиотеки Axios
 * @returns Promise, который передаст ответ сервера в формате fetch
 */
function proxyResponseAxiosFetch(
  response: AxiosResponse & { message?: string }
): Promise<any> {
  let options: ResponseInit & { url: string };
  let body;

  if (response.message === CancelRequest) {
    options = {
      status: EHttpCodes.CLIENT_CLOSED_REQUEST,
      statusText: "Client Closed Request",
      headers: new Headers({}),
      url: "",
    };
    body = JSON.stringify(response);

    return Promise.reject(new Response(body, options));
  }
  const xhr = response.request;

  options = {
    status: xhr.status,
    statusText: xhr.statusText,
    headers: new Headers((response.headers as any) || {}),
    url:
      "responseURL" in xhr
        ? xhr.responseURL
        : xhr.getResponseHeader("X-Request-URL"),
  };
  body = "response" in xhr ? xhr.response : xhr.responseText;

  return Promise.resolve(new Response(body, options));
}

export function createUploadLink(graphqlURL: string) {
  return new ApolloLink((operation) => {
    const uri = selectURI(operation, graphqlURL);

    /**
     * Контекст запроса, в котором хранятся все дополнительные данные, которые должны быть
     * отправлены на сервер. Устанавливается как параметр context в конфигурации, передаваемой
     * методам query и mutate класса ApolloClient
     */
    const context = operation.getContext();
    const contextConfig = {
      http: context.http,
      options: context.fetchOptions,
      credentials: context.credentials,
      headers: context.headers,
    };
    const { options, body } = selectHttpOptionsAndBody(
      operation,
      fallbackHttpConfig,
      contextConfig
    );
    const imRequestData =
      context && context.imRequestData ? context.imRequestData : {};
    const files = imRequestData.files ? imRequestData.files : [];

    /**
     * здесь формируется тело запроса, в котором есть файлы для загрузки, и все поля graphql
     * запроса переносятся в FormData, поскольку запрос получает параметр multipart/form-data и все
     * данные должны отправляться как поля формы
     */
    let customBody: FormData;
    if (files && files.length) {
      options?.headers && delete options.headers["content-type"];
      customBody = new FormData();
      customBody.append("operationName", body.operationName as string);
      customBody.append("variables", JSON.stringify(body.variables));
      customBody.append("query", body.query as string);
      forEach(files, (file, index) =>
        customBody.append(index, file, file.name)
      );
    }

    return new Observable((observer) => {
      const { controller, signal } = createSignalIfSupported();

      if (controller) {
        options.signal = signal;
      }

      const config = {
        baseURL: "/",
        url: uri,
        data: customBody ? customBody : body,
        method: options.method,
        responseType: "text",
        responseEncoding: "utf8",
        cancelToken: imRequestData.cancelToken,
        onUploadProgress: imRequestData.onUploadProgress,
        headers: {
          ...options.headers,
          "URI-Encoding": "1",
        },
      } as AxiosRequestConfig;

      axios(config)
        .then(proxyResponseAxiosFetch, proxyResponseAxiosFetch)
        .then((response) => {
          operation.setContext({
            response,
          });
          return response;
        })
        .then(parseAndCheckHttpResponse(operation))
        .then((result) => {
          observer.next(result);
          observer.complete();
        })
        .catch((error) => {
          if (error.name === "AbortError") {
            return;
          }

          if (error.result && error.result.errors && error.result.data) {
            observer.next(error.result);
          }

          if (error.status !== EHttpCodes.CLIENT_CLOSED_REQUEST) {
            observer.error(error);
          }
        });

      return () => {
        if (controller && controller instanceof AbortController) {
          controller.abort();
        }
      };
    });
  });
}

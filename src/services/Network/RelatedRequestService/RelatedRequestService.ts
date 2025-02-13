import { BaseRequestService } from "../BaseRequestService";
import type { TRequestDataParams } from "../Requests.types";
import type { TRelatedRequestData } from "./RelatedRequestService.types";
import { XTraceIdHeaderKey } from "@infomaximum/utility";
import type { NCore } from "@infomaximum/module-expander";
import { assertSimple } from "@infomaximum/assert";
import { apolloInstance } from "../../../utils/Store/Apollo";

export class RelatedRequestService extends BaseRequestService {
  public override async requestData(params: TRequestDataParams<TRelatedRequestData>): Promise<any> {
    const { additionalParams, cancelable } = params;

    if (additionalParams?.relatedQueries) {
      const apolloClient = apolloInstance.apolloClient;
      let response: any = null;
      const { cancelToken, cancelCallback } = this.getCancelToken();

      this.controlCancelableRequests({
        cancelable,
        cancelCallbackCurrent: cancelCallback,
        cancelCallbackPrev: this.cancelCallbackRequest,
      });

      for await (const chainLink of additionalParams.relatedQueries) {
        const { query, variables, skipThis } = chainLink.getQueryParams({
          prevResponse: response,
        });

        if (skipThis) {
          return response;
        }

        const config = {
          query,
          variables,
          context: {
            imRequestData: {
              cancelToken,
            },
            http: {
              preserveHeaderCase: true,
            },
          },
        };

        try {
          const nextResponse = await apolloClient.query(config);
          const combinedResponse = chainLink?.responseCombiner?.(
            response,
            nextResponse?.data ?? nextResponse
          );

          if (!!nextResponse?.data?.error || nextResponse.error) {
            throw nextResponse?.data?.error || nextResponse.error;
          } else {
            response = combinedResponse?.data ?? combinedResponse;
          }
        } catch (e) {
          const error: NCore.TError | undefined = await this.errorHandlerService.prepareError(e, {
            traceId: e.networkError?.response?.headers.get(XTraceIdHeaderKey),
          });

          throw error || e;
        }
      }

      return response;
    }

    assertSimple(
      false,
      "Был передан инстанс класса для цепочки запросов, но не передана сама цепочка"
    );
  }
}

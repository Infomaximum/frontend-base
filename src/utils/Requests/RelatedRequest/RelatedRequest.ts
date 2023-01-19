import { BaseRequest } from "../BaseRequest/BaseRequest";
import type { NRequests } from "../Requests.types";
import type { TRelatedRequestData } from "./RelatedRequest.types";
import { apolloInstance } from "@im/base/src/utils/Store/Apollo";
import { assertSimple, XTraceIdHeaderKey } from "@im/utils";
import type { NCore } from "@im/core";
import { v4 as uuid4 } from "uuid";

class RelatedRequest extends BaseRequest {
  public override async requestData(
    params: NRequests.TRequestDataParams<TRelatedRequestData>
  ): Promise<any> {
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

        const traceId = uuid4();
        const config = {
          query,
          variables,
          context: {
            imRequestData: {
              cancelToken,
            },
            headers: {
              [XTraceIdHeaderKey]: traceId,
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
          const error: NCore.TError | undefined = await this.errorHandlerInstance.prepareError(e, {
            traceId,
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

export default RelatedRequest;

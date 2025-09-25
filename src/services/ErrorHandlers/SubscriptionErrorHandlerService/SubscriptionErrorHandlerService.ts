import { get } from "lodash";
import type { NCore } from "@infomaximum/base/src/libs/core";
import { BaseErrorHandlerService } from "../BaseErrorHandlerService";

type TGraphqlError = {
  code: string;
  message: string;
};

export class SubscriptionErrorHandlerService extends BaseErrorHandlerService {
  private isWSError(err: any): err is WebSocketEventMap["error"] {
    return err instanceof Event;
  }

  public override async prepareError(
    graphqlError: NCore.TGraphqlError,
    params?: NCore.TErrorHandlerParams | undefined
  ): Promise<NCore.TError | undefined> {
    const errors = get(graphqlError, "graphQLErrors") as
      | TGraphqlError[]
      | WebSocketEventMap["error"][]
      | undefined;

    const firstError = errors?.at(0);

    if (this.isWSError(firstError)) {
      return;
    }

    if (firstError) {
      const normalizedError = this.createNormalizedError(firstError, params);
      await this.handleError(normalizedError);

      return normalizedError;
    }
  }
}

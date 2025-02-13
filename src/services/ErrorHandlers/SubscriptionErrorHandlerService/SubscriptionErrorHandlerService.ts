import { get } from "lodash";
import type { NCore } from "../../../libs/core";
import { BaseErrorHandlerService } from "../BaseErrorHandlerService";

type TGraphqlError = {
  code: string;
  message: string;
};

export class SubscriptionErrorHandlerService extends BaseErrorHandlerService {
  public override async prepareError(
    graphqlError: NCore.TGraphqlError,
    params?: NCore.TErrorHandlerParams | undefined
  ): Promise<NCore.TError | undefined> {
    const errors = get(graphqlError, "graphQLErrors") as TGraphqlError[] | undefined;

    const firstError = errors?.at(0);

    if (firstError) {
      const normalizedError = this.createNormalizedError(firstError, params);
      await this.handleError(normalizedError);

      return normalizedError;
    }
  }
}

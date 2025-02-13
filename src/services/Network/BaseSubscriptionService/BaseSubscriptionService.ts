import { isFunction } from "lodash";
import type { ISubscriptionService, TSubscribeParams } from "../Subscriptions.types";
import type { Subscription } from "zen-observable-ts";
import type { IErrorHandlerService } from "../../ErrorHandlers/ErrorHandlers.types";
import { SubscriptionErrorHandlerService } from "../../ErrorHandlers";
import { apolloInstance } from "../../../utils/Store/Apollo";

type TSubscriptionParams = {
  /** Инстанс обработчика ошибок */
  errorHandlerService?: IErrorHandlerService;
};

export class BaseSubscriptionService implements ISubscriptionService {
  protected subscription: Subscription | undefined = undefined;
  protected isFirstMessage: boolean = true;
  protected errorHandlerService: IErrorHandlerService;

  constructor(params?: TSubscriptionParams) {
    this.errorHandlerService = params?.errorHandlerService ?? new SubscriptionErrorHandlerService();
  }

  public subscribe(params: TSubscribeParams) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    const apolloClient = apolloInstance.apolloClient;

    const observer = apolloClient.subscribe(params.config);

    this.subscription = observer.subscribe(
      (response) => {
        if (isFunction(params.onMessage)) {
          params.onMessage({
            response,
            first: self.isFirstMessage,
          });
        }

        if (self.isFirstMessage) {
          self.isFirstMessage = false;
        }
      },
      (err) => {
        this.errorHandlerService.prepareError(err, {}).then((error) => {
          if (isFunction(params.onError)) {
            (params.onError as (typeof params)["onError"])({
              error: error || err,
            });
          }
        });
      }
    );
  }

  public unsubscribe() {
    this.subscription?.unsubscribe?.();

    this.subscription = undefined;
  }
}

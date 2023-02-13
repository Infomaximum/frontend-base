import type { NRequests } from "../Requests.types";

export declare namespace NBaseRequest {
  type TCallback = {
    callback: (() => void) | undefined;
  };

  type TControlCancelableRequestsParams = {
    cancelCallbackCurrent: () => void;
    cancelCallbackPrev: TCallback;
    cancelable: NRequests.TCancelable;
  };
}

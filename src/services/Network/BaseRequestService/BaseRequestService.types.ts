import type { TCancelableRequest } from "../Requests.types";

export type TCancelableCallback = {
  callback: ((cb?: () => void) => void) | undefined;
};

export type TControlCancelableRequestsParams = {
  cancelCallbackCurrent: () => void;
  cancelCallbackPrev: TCancelableCallback;
  cancelable: TCancelableRequest;
};

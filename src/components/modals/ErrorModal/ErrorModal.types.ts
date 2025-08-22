import type { NCore } from "@infomaximum/base/src/libs/core";

export interface IErrorModalProps {
  showModal: boolean;
  error: NCore.TError | undefined;
  onCloseModal: () => void;
  maskTransitionName?: string;
  footerButtons?: React.ReactNode[];

  isDebugMode?: boolean;
}

import type { NCore } from "@infomaximum/module-expander";

export interface IErrorModalProps {
  showModal: boolean;
  error: NCore.TError | undefined;
  onCloseModal: () => void;
  maskTransitionName?: string;
  footerButtons?: React.ReactNode[];

  isDebugMode?: boolean;
}

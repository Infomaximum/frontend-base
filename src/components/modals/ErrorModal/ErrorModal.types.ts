import type { NCore } from "@im/core";

export interface IErrorModalProps {
  showModal: boolean;
  error: NCore.TError | undefined;
  onCloseModal: () => void;

  isDebugMode?: boolean;
}

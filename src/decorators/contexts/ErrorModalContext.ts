import type { NCore } from "@infomaximum/module-expander";
import { assertSimple } from "@infomaximum/assert";
import { createContext } from "react";

export interface IErrorModalContextContextData {
  showModalError: (error: NCore.TError | undefined, closeCb?: () => void) => void;
}

export const ErrorModalContext = createContext<IErrorModalContextContextData>({
  showModalError() {
    assertSimple(
      process.env.NODE_ENV === "test",
      "showModalError вызывается вне ErrorModalProvider"
    );
  },
});

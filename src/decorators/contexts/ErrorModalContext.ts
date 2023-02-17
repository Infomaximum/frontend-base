import type { NCore } from "@im/core";
import { assertSimple } from "@im/asserts";
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

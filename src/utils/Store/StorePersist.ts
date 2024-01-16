import Aes from "crypto-js/aes";
import CryptoJsCore from "crypto-js/core";
import { reaction } from "mobx";
import { Expander } from "@infomaximum/module-expander";
import { isEmpty, isString } from "lodash";
import type { BaseStore } from "./BaseStore";

class StorePersist {
  private static secretKey: string | null = null;

  /**
   *  По дефолту сгенерирован 192-битный ключ (base64). Это уровень TOP SECRET для AES шифрования
   */
  private static readonly defaultSecretKey: string =
    "Gd3Ht5KbVpgQ8EB/oyo4nWPTQBi/3WftESvJxnLiLryprrDtA5xWqJhld4FN72WkuiFrmsO/Vjc7bNd6JAp06+24LQCN548T2UwRsWs8sk5yDsxzkoH3IGg9J3LOQpYsdW0jnV6CHhLtH+8T39X4qf620PhihbtHjNs0cC2KpKHYm0rZ7jZcyLtNaTVkFpYuLl7EKcv/+hlHToYAVCtN3eIo/TFmTk74LO2R9c254kKJPLSPtRRX9iXjGviclgOg";

  public static autoSave(store: BaseStore, name: string) {
    Expander.getInstance().runWhenAppReady(() => {
      const localStorageValue = localStorage.getItem(name);
      if (localStorageValue) {
        const restoreStruct = JSON.parse(this.decrypt(localStorageValue));
        store.restoreByStruct(restoreStruct);
      }

      reaction(
        () => store.toJSON(),
        (value) => {
          if (value) {
            localStorage.setItem(name, this.encrypt(value));
          } else {
            localStorage.removeItem(name);
          }
        }
      );
    });
  }

  public static replaceSaved(store: BaseStore, name: string, saveJsonCandidate: string | null) {
    Expander.getInstance().runWhenAppReady(() => {
      try {
        if (isString(saveJsonCandidate)) {
          const decrypt = this.decrypt(saveJsonCandidate);
          const restoreStruct = JSON.parse(decrypt);

          if (decrypt && !isEmpty(restoreStruct)) {
            localStorage.setItem(name, saveJsonCandidate);
            // сбрасываем все состояние фильтров, чтобы создать новое
            store.reset();
            store.restoreByStruct(restoreStruct);
          }
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Неизвестный хэш фильтра.");
      }
    });
  }

  public static subscribeSaved(
    store: BaseStore,
    name: string,
    callback: (localStorageValue: string | null) => void
  ) {
    Expander.getInstance().runWhenAppReady(() => {
      reaction(
        () => store.toJSON(),
        () => {
          const localStorageValue = localStorage.getItem(name);
          callback(localStorageValue);
        }
      );
    });
  }

  public static setSecretKey(secretKey: string): void {
    this.secretKey = secretKey;
  }

  private static getSecretKey(): string {
    return this.secretKey || this.defaultSecretKey;
  }

  private static encrypt(savedJson: string): string {
    return savedJson && Aes.encrypt(savedJson, this.getSecretKey()).toString();
  }

  private static decrypt(savedJson: string): string {
    return savedJson && Aes.decrypt(savedJson, this.getSecretKey()).toString(CryptoJsCore.enc.Utf8);
  }
}

export { StorePersist };

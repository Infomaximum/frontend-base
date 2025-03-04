import Aes from "crypto-js/aes";
import CryptoJsCore from "crypto-js/core";
import { reaction } from "mobx";
import { Expander } from "@infomaximum/module-expander";
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
      const struct = this.getStruct(name);

      if (struct) {
        store.restoreByStruct(struct);
      }

      reaction(
        () => store.toJSON(),
        (value) => this.save(name, value)
      );
    });
  }

  public static getStruct(key: string) {
    const localStorageValue = localStorage.getItem(key);

    return localStorageValue === null ? null : JSON.parse(this.decrypt(localStorageValue));
  }

  public static save(key: string, value: string | null) {
    if (value) {
      localStorage.setItem(key, this.encrypt(value));
    } else {
      localStorage.removeItem(key);
    }
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

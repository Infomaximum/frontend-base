import { includes } from "lodash";
import { spy } from "mobx";
import type { NBaseStore } from "./BaseStore.types";

/** Базовый  стор */
export abstract class BaseStore {
  protected static registrationStores = new Set<BaseStore>();

  /** Отладка сторов */
  public static debugStores(stores?: BaseStore[]) {
    if (process.env.NODE_ENV === "development") {
      spy((event) => {
        if (event.type === "action" && (stores ? includes(stores, event.object) : true)) {
          // eslint-disable-next-line no-console
          console.warn(
            `${(event.object as BaseStore)?.name ?? event.name}: ${
              event.name
            } with args: ${JSON.stringify(event.arguments)}`
          );
        }
      });
    }
  }

  protected name: string;

  constructor({ name }: NBaseStore.IBaseStoreParams) {
    this.name = name;

    BaseStore.registrationStores.add(this);
  }

  /** Метод сброса данных в начальное состояние */
  public abstract reset(): void;

  /** Метод возвращающий Json для данного store */
  public toJSON(): string | null {
    return null;
  }

  /** Метод восстановления данных store по распарсенному Json */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public restoreByStruct(restoreStruct: any) {}
}

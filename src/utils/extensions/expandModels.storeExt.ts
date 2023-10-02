import { get, set, map } from "lodash";
import type { NStore } from "../Store/Store/Store.types";
import type { Store } from "../Store/Store/Store";
import { assertSimple } from "@infomaximum/assert";
import type { Model } from "@infomaximum/graphql-model";

export const expandModelsStoreExt =
  (itemWrapperField: string, itemsPath: string = "items"): NStore.TPrepareDataFunc<Store<Model>> =>
  ({ data }) => {
    if (!data) {
      return null;
    }

    const sourceItems = get(data, itemsPath);

    if (!sourceItems) {
      return data;
    }

    // todo: рассмотреть возможность полного клонирования, для корректной работы c ApolloCache
    // для случаев с itemsPath 2-го и более порядка
    const clonedData = { ...data };

    const items = map(sourceItems, (sourceItem) => {
      const nestedData = get(sourceItem, itemWrapperField);

      assertSimple(
        nestedData,
        `В данных не найдено поле ${itemWrapperField}, указанное в expandModelsStoreExt`
      );

      const { [itemWrapperField]: omittedField, ...nearbyData } = sourceItem;

      return { ...nearbyData, ...nestedData };
    });

    set(clonedData, `${itemsPath}`, items);

    return clonedData;
  };

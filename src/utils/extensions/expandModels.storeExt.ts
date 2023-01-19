import { get, set, map } from "lodash";
import { assertSimple, Model } from "@im/utils";
import type { NStore } from "@im/base/src/utils/Store/Store/Store.types";
import type { Store } from "@im/base/src/utils/Store/Store/Store";

export default (
    itemWrapperField: string,
    itemsPath: string = "items"
  ): NStore.TPrepareDataFunc<Store<Model>> =>
  ({ data }) => {
    if (!data) {
      return null;
    }

    const sourceItems = get(data, itemsPath);

    if (!sourceItems) {
      return data;
    }

    const items = map(sourceItems, (sourceItem) => {
      const nestedData = get(sourceItem, itemWrapperField);

      assertSimple(
        nestedData,
        `В данных не найдено поле ${itemWrapperField}, указанное в expandModelsStoreExt`
      );

      const { [itemWrapperField]: omittedField, ...nearbyData } = sourceItem;

      return { ...nearbyData, ...nestedData };
    });

    set(data, `${itemsPath}`, items);

    return data;
  };

import type { Model, TModelStruct } from "@infomaximum/graphql-model";
import { InvalidIndex } from "@infomaximum/utility";
import { forEach, get, isNull, isEmpty, map } from "lodash";
import type { NStore } from "../Store/Store/Store.types";
import type { Store } from "../Store/Store/Store";
import { RestModel } from "../../models";

type TTreeBuilderParams = {
  // typename группы
  groupTypename: string;

  // Ключ массива с id родителей
  parentsIdsField: string;

  // Ключ обертки над элементом плоского списка, например, "element"
  itemWrapperField?: string;

  // добавлять ли цепочку родителей в каждый элемент в поле "parents"
  isAddParentsChain?: boolean;
};

const childrenKey = "items";

const defaultItemWrapperField = "element";

/**
 * Функция работает только если родительские элементы приходят в списке раньше своих дочерних.
 * Иначе потребуются более затратные вычисления.
 */
export function buildTreeFromList(sourceList: TModelStruct[], params: TTreeBuilderParams) {
  const {
    parentsIdsField,
    groupTypename,
    itemWrapperField = defaultItemWrapperField,
    isAddParentsChain = false,
  } = params;
  /**
   * Временное хранилище для ссылок на родительские элементы дерева
   */
  const parentsStore = new Map();

  const tree: TModelStruct[] = [];

  forEach(sourceList, (sourceItem) => {
    /**
     * id родителей распологаются в порядке от самого верхнего до самого глубокого.
     */
    const parentsIds = sourceItem[parentsIdsField];
    const parentId = parentsIds[parentsIds.length - 1];

    /**
     * Вытаскиваем данные из вложенного поля.
     */
    const nestedData = get(sourceItem, itemWrapperField);

    let item;

    if (isNull(nestedData)) {
      /**
       * Если нет данных во вложенном поле, считаем, что этот элемент - RestModel
       */
      item = getRestItemStruct();
    } else {
      const { [itemWrapperField]: omittedField, ...nearbyData } = sourceItem;

      item = { ...nearbyData, ...nestedData };
    }

    let parent: TModelStruct;

    if (isAddParentsChain) {
      const parentsChain = map(parentsIds, (id) => parentsStore.get(id));
      item.parents = parentsChain;
      parent = parentsChain[parentsChain.length - 1];
    } else {
      parent = parentsStore.get(parentId);
    }

    /**
     * Если item - группа, сохраняем его для дальнейшего поиска по нему в качестве родителя
     */
    if (item.__typename === groupTypename) {
      item[childrenKey] = [];

      parentsStore.set(item.id, item);
    }

    if (isEmpty(parentsIds)) {
      /**
       * Добавляем элемент в корень
       */
      tree.push(item);
    } else {
      /**
       *  Иначе добавляем ребенка в найденного родителя
       */
      parent[childrenKey].push(item);
    }
  });

  return tree;
}

function getRestItemStruct() {
  return {
    __typename: RestModel.typename,
  };
}

/**
 * Подменяет getData, формируя из плоских данных дерево
 */
export const graphqlTreeStoreExt =
  (params: TTreeBuilderParams): NStore.TPrepareDataFunc<Store<Model>> =>
  ({ data }) =>
    data
      ? {
          id: InvalidIndex,
          items: buildTreeFromList(data.elements, params),
          __typename: params.groupTypename,
        }
      : data;

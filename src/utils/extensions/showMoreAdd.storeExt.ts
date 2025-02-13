import { isArray } from "lodash";
import type { NStore } from "../Store/Store/Store.types";
import type { Model, TModelStruct } from "@infomaximum/graphql-model";
import type { Store } from "../Store/Store/Store";
import { RestModel } from "../../models";

interface IParams {
  groupFieldNames: string[];
  hasNextFieldNames: string[];
}

export const getRestItemStruct = () => {
  return {
    __typename: RestModel.typename,
  };
};

const populateWithRest = (
  data: TModelStruct,
  groupFieldNames: string[],
  hasNextFieldNames: string[]
) => {
  let groupFieldName: string | null = null;
  let hasNextFieldName: string | null = null;
  let items: any[] | null = null;
  let newData: TModelStruct | null = null;

  for (let groupIndex = 0; groupIndex < groupFieldNames.length; groupIndex += 1) {
    groupFieldName = groupFieldNames[groupIndex] ?? null;

    if (groupFieldName && data[groupFieldName]) {
      newData = { ...data };

      if (isArray(newData[groupFieldName])) {
        items = newData[groupFieldName] = [...newData[groupFieldName]];
        // нашли поле со списком
        break;
      }

      newData[groupFieldName] = { ...newData[groupFieldName] };

      newData[groupFieldName] = populateWithRest(
        newData[groupFieldName],
        groupFieldNames,
        hasNextFieldNames
      );

      return newData;
    }

    groupFieldName = null;
  }

  if (!groupFieldName) {
    return data;
  }

  for (
    let hasNextFieldIndex = 0;
    hasNextFieldIndex < hasNextFieldNames.length;
    hasNextFieldIndex += 1
  ) {
    hasNextFieldName = hasNextFieldNames[hasNextFieldIndex] ?? null;

    if (hasNextFieldName && data[hasNextFieldName]) {
      // нашли поле, где хранится состояние для "показать еще"
      break;
    }

    hasNextFieldName = null;
  }

  if (items) {
    for (let itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
      const item = items[itemIndex];
      items[itemIndex] = populateWithRest(item, groupFieldNames, hasNextFieldNames);
    }
  }

  if (hasNextFieldName && items) {
    items.push(getRestItemStruct());
  }

  return newData;
};

/**
 * Добавляет списки элементов в данных записи "показать еще", рассчитываемые на основе наличия у группы состояния
 *  "наличие непоказанных записей". Имя поля вычисляется из списка переданных
 * {@link params.hasNextFieldNames} и данных в списках.
 * @param {Object} [params={}]
 * @property {Array.<string>} [params.groupFieldNames=['items']] - Список имен полей, в которых могут лежать вложенные
 * элементы. Из-за разного формата списков с сервера имена полей могут быть разными для разных уровней вложенности
 * (например программы лежат в поле `items`, а окна в программах - в полей `windows`)
 * @property {Array.<string>} [params.hasNextFieldNames=['has_next']] - Список имен полей, в которых может
 * лежать состояние наличия не показанных элементов списка. Может быть разным в зависимости от типа списка
 * (has_next, next_windows_count)
 * @returns {Function}
 */
export const showMoreAddStoreExt = (params = {}): NStore.TPrepareDataFunc<Store<Model>> => {
  const { groupFieldNames = ["items"], hasNextFieldNames = ["has_next"] } = params as IParams;

  return ({ data }) => (data ? populateWithRest(data, groupFieldNames, hasNextFieldNames) : data);
};

import { isArray, isNumber } from "lodash";
import type { NStore } from "src/utils/Store/Store/Store.types";
import type { Model, TModelStruct } from "@im/models";
import type { Store } from "src/utils/Store/Store/Store";

export const REST_GRAPHQL_FAKE_TYPE = "rest";

interface IParams {
  groupFieldNames: string[];
  nextCountFieldNames: string[];
}

export const getRestItemStruct = (nextCount: any) => {
  return {
    next_count: isNumber(nextCount) ? nextCount : null,
    __typename: REST_GRAPHQL_FAKE_TYPE,
  };
};

const populateWithRest = (
  data: TModelStruct,
  groupFieldNames: string[],
  nextCountFieldNames: string[]
) => {
  let groupFieldName: string | null = null;
  let nextCountFieldName: string | null = null;
  let items: any[] | null = null;
  let newData: TModelStruct | null = null;

  for (
    let groupIndex = 0;
    groupIndex < groupFieldNames.length;
    groupIndex += 1
  ) {
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
        nextCountFieldNames
      );

      return newData;
    }
    groupFieldName = null;
  }

  if (!groupFieldName) {
    return data;
  }

  for (
    let nextCountFieldIndex = 0;
    nextCountFieldIndex < nextCountFieldNames.length;
    nextCountFieldIndex += 1
  ) {
    nextCountFieldName = nextCountFieldNames[nextCountFieldIndex] ?? null;

    if (nextCountFieldName && data[nextCountFieldName]) {
      // нашли поле, где хранится количество элементов для "показать еще"
      break;
    }
    nextCountFieldName = null;
  }

  if (items) {
    for (let itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
      const item = items[itemIndex];
      items[itemIndex] = populateWithRest(
        item,
        groupFieldNames,
        nextCountFieldNames
      );
    }
  }

  if (nextCountFieldName && items) {
    items.push(getRestItemStruct(data[nextCountFieldName]));
  }

  return newData;
};

/**
 * Добавляет списки элементов в данных записи "показать еще", рассчитываемые на основе наличия у группы значения
 * в полей "количество непоказанных записей". Имя поля вычисляется из списка переданных
 * {@link params.nextCountFieldNames} и данных в списках.
 * @param {Object} [params={}]
 * @property {Array.<string>} [params.groupFieldNames=['items']] - Список имен полей, в которых могут лежать вложенные
 * элементы. Из-за разного формата списков с сервера имена полей могут быть разными для разных уровней вложенности
 * (например программы лежат в поле `items`, а окна в программах - в полей `windows`)
 * @property {Array.<string>} [params.nextCountFieldNames=['next_count']] - Список имен полей, в которых может
 * лежать количество не показанных элементов списка. Может быть разным в зависимости от типа списка
 * (next_count, next_windows_count)
 * @returns {Function}
 */
export const showMoreAdd = (
  params = {}
): NStore.TPrepareDataFunc<Store<Model>> => {
  const { groupFieldNames = ["items"], nextCountFieldNames = ["next_count"] } =
    params as IParams;

  return ({ data }) =>
    data ? populateWithRest(data, groupFieldNames, nextCountFieldNames) : data;
};

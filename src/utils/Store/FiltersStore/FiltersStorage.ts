import { isFunction, forEach } from "lodash";
import { assertSimple } from "@infomaximum/base/src";
import type { NFiltersStore } from "./FiltersStore.types";

class FilterStorage {
  private static filterSet: { [key: string]: any } = {};
  /**
   * Данный ключ нужно использовать в случае, когда фильтры хранятся раздельно по сущностям.
   * Это необходимо для того чтобы при сохранении в localStorage делать меньше проверок
   */
  public static readonly SPLIT_STORAGE_KEY = "splitStorageKey";

  public static getFilterSet() {
    return this.filterSet;
  }

  public static addFilterDescriptionList(
    filterDescriptionList: {
      typename: string;
      FilterClass: NFiltersStore.IFilterDescriptionClass;
    }[]
  ): void {
    forEach(filterDescriptionList, (filterDescription) => {
      this.addFilterDescription(filterDescription.typename, filterDescription.FilterClass);
    });
  }

  public static addFilterDescription(
    typename: string,
    FilterClass: NFiltersStore.IFilterDescriptionClass
  ) {
    if (isFunction(FilterClass.restoreFilterByStruct)) {
      if (this.filterSet) {
        this.filterSet[typename] = FilterClass;
      }
    } else {
      assertSimple(
        false,
        `Фильтр с typename ${typename} не имеет статично метода восстановления restoreFilterByStruct из localStorage`
      );
    }
  }
}

export { FilterStorage };

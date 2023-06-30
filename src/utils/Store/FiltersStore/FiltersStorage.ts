import { isFunction, forEach } from "lodash";
import { assertSimple } from "@infomaximum/assert";
import type { NFiltersStore } from "./FiltersStore.types";

class FilterStorage {
  private static filterSet: {
    [key: string]: NFiltersStore.IFilterDescriptionStaticStruct | undefined;
  } = {};
  /**
   * Данный ключ нужно использовать в случае, когда фильтры хранятся раздельно по сущностям.
   * Это необходимо для того чтобы при сохранении в localStorage делать меньше проверок
   */
  public static readonly SPLIT_STORAGE_KEY = "splitStorageKey";

  public static getFilterSet() {
    return this.filterSet;
  }

  public static addFilterDescriptionList(
    filterDescriptionList: NFiltersStore.TFilterDescriptionStruct[]
  ): void {
    forEach(filterDescriptionList, (filterDescription) => {
      this.addFilterDescription(filterDescription.typename, filterDescription.FilterClass);
    });
  }

  public static addFilterDescription(
    typename: string,
    FilterClass: NFiltersStore.IFilterDescriptionStaticStruct
  ) {
    assertSimple(
      isFunction(FilterClass.restoreFilterByStruct),
      `Фильтр с typename ${typename} не имеет статично метода восстановления restoreFilterByStruct из localStorage`
    );

    if (this.filterSet) {
      this.filterSet[typename] = FilterClass;
    }
  }
}

export { FilterStorage };

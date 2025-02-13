import { isFunction, forEach } from "lodash";
import { assertSilent, assertSimple } from "@infomaximum/assert";
import type { NFiltersStore } from "./FiltersStore.types";
import type { FiltersStore } from "./FiltersStore";

interface IFilterSet {
  [key: string]: NFiltersStore.IFilterDescriptionStaticStruct | undefined;
}

class FilterStorage {
  private static filterMap: WeakMap<FiltersStore, IFilterSet> = new WeakMap();

  public static getFilterSet(store: FiltersStore): IFilterSet {
    assertSimple(
      this.filterMap.has(store),
      `Для хранилища "${store.name}" не задан набор фильтров`
    );

    return this.filterMap.get(store) ?? {};
  }

  public static deleteFilterSet(store: FiltersStore): void {
    this.filterMap.delete(store);
  }

  public static addFilterDescriptionList(
    store: FiltersStore,
    filterDescriptionList: NFiltersStore.TFilterDescriptionStruct[]
  ): void {
    forEach(filterDescriptionList, (filterDescription) => {
      this.addFilterDescription(store, filterDescription.typename, filterDescription.FilterClass);
    });
  }

  public static addFilterDescription(
    store: FiltersStore,
    typename: string,
    FilterClass: NFiltersStore.IFilterDescriptionStaticStruct
  ) {
    assertSimple(
      isFunction(FilterClass.restoreFilterByStruct),
      `Фильтр с typename ${typename} не имеет статично метода восстановления restoreFilterByStruct из localStorage`
    );

    if (this.filterMap.has(store)) {
      const filterSet = this.filterMap.get(store);

      assertSilent(
        !(filterSet?.[typename] && filterSet[typename] !== FilterClass),
        `Фильтр c typename "${typename}" для хранилища "${store.name}" уже зарегистрирован.
        Убедитесь, что метод restoreFilterByStruct у уже существующего класса по сравнении с добавляемым
        восстанавливает одну и ту же модель или объект`
      );

      this.filterMap.set(store, {
        ...filterSet,
        [typename]: FilterClass,
      });
    } else {
      this.filterMap.set(store, {
        [typename]: FilterClass,
      });
    }
  }
}

export { FilterStorage };

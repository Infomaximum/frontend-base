import { AutoCompleteListModel } from "../../../models/AutoCompleteListModel";
import { forEach } from "lodash";
import { computed, makeObservable, override } from "mobx";
import { Store } from "../Store/Store";
import type { NStore } from "../Store/Store.types";
import type { IModel } from "@infomaximum/graphql-model";

type TPrivateAutoCompleteStoreField = "receiveData";

/**
 * Стор используемый в автокомплитах
 *
 * @example
 * const employeesAutocompleteStore = new AutoCompleteStore({
 *    dataPath: "employee.employee_autocomplete",
 *    getQueryParams({ variables }) {
 *      return {
 *        query: employeesAutocompleteQuery,
 *        ...variables
 *      };
 *    },
 * })
 *
 */
export class AutoCompleteStore<
  M extends AutoCompleteListModel = AutoCompleteListModel
> extends Store<M> {
  constructor(params: NStore.TStoreParams<AutoCompleteStore<M>>) {
    super({
      ...params,
      getQueryParams(getterQueryParams: NStore.TParamsGetterArg<AutoCompleteStore<M>>) {
        const queryParams = (params as NStore.TStoreParams<any>).getQueryParams(getterQueryParams);

        return {
          ...queryParams,
          variables: {
            paging: queryParams?.variables?.paging || {
              limit: 20,
            },
            text_filter: {
              text: this.searchValue || null,
            },
            ...queryParams?.variables,
          },
        };
      },
    });

    makeObservable<this, TPrivateAutoCompleteStoreField>(this, {
      receiveData: override,
      searchValueChange: override,
      map: computed,
    });
  }

  // ----------------------------------------COMPUTED------------------------------------//

  public get map() {
    if (this._model) {
      const list: Map<string | number, IModel> = new Map<string | number, IModel>();

      forEach(this._model.getItems(), (item) => {
        list.set(item.getInnerName(), item);
      });

      return list;
    }

    return null;
  }

  // ----------------------------------------ACTIONS------------------------------------//
  public override receiveData(struct: { id: number; __typename: string }) {
    this._data = struct;

    this._model = struct
      ? (new AutoCompleteListModel({
          struct,
        }) as M)
      : null;
  }

  public override searchValueChange(value: string | undefined, variables?: TDictionary) {
    super.searchValueChange(value);

    this.requestData({ variables });
  }
}

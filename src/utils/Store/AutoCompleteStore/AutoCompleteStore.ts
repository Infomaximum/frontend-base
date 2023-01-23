import AutoCompleteListModel from "src/models/AutoCompleteListModel";
import { forEach } from "lodash";
import { computed, makeObservable, override } from "mobx";
import type { IModel } from "@im/utils";
import { Store } from "../Store/Store";
import type { NStore } from "../Store/Store.types";

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
class AutoCompleteStore<
  M extends AutoCompleteListModel = AutoCompleteListModel
> extends Store<M> {
  constructor(params: NStore.TStoreParams<AutoCompleteStore<M>>) {
    super({
      ...params,
      getQueryParams(
        getterQueryParams: NStore.TParamsGetterArg<AutoCompleteStore<M>>
      ) {
        const queryParams = (params as NStore.TStoreParams<any>).getQueryParams(
          getterQueryParams
        );

        return {
          ...queryParams,
          variables: {
            paging: queryParams?.variables?.paging || {
              limit: 20,
            },
            textFilter: {
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
      list: computed,
    });
  }

  //----------------------------------------COMPUTED------------------------------------//

  public get list() {
    if (this._model) {
      const list: TDictionary<IModel> = {};

      forEach(this._model.getItems(), (item) => {
        list[item.getInnerName()] = item;
      });

      return list;
    }

    return null;
  }

  //----------------------------------------ACTIONS------------------------------------//
  public override receiveData(struct: { id: number; __typename: string }) {
    this._data = struct;

    this._model = struct
      ? (new AutoCompleteListModel({
          struct,
        }) as M)
      : null;
  }

  public override searchValueChange(
    value: string | undefined,
    variables?: TDictionary
  ) {
    super.searchValueChange(value);

    this.requestData({ variables });
  }
}

export default AutoCompleteStore;

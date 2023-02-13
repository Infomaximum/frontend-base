import type { NStore } from "../Store/Store/Store.types";
import { InvalidIndex } from "@im/utils";
import type { TableStore } from "../Store/TableStore/TableStore";

export const wrapInFakeListPrepareData =
  (fakeListTypename: string): NStore.TPrepareDataFunc<TableStore<any>> =>
  ({ data }) =>
    data
      ? { id: InvalidIndex, items: data, __typename: fakeListTypename }
      : data;

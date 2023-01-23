import type { NStore } from "src/utils/Store/Store/Store.types";
import { InvalidIndex } from "@im/utils";
import type TableStore from "src/utils/Store/TableStore/TableStore";

export const wrapInFakeListPrepareData =
  (fakeListTypename: string): NStore.TPrepareDataFunc<TableStore<any>> =>
  ({ data }) =>
    data
      ? { id: InvalidIndex, items: data, __typename: fakeListTypename }
      : data;

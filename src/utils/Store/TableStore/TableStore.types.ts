import type { IModel } from "@im/models";
import type { TreeCounter } from "../../../managers/TreeCounter";
import type { ELimitsStateNames } from "../../../utils/const";
import type { NStore } from "../Store/Store.types";
import type { RestModel } from "../../../models/RestModel";
import type { TableStore } from "./TableStore";

export declare namespace NTableStore {
  type TTableStoreParams<S extends TableStore<any>> = NStore.TStoreParams<S> & {
    /** Дерево? */
    isTree: boolean;
  };

  type TShowMore = {
    [K in ELimitsStateNames]?: {
      [x: number]: number;
    };
  };

  type TActionShowMoreParams = {
    limitsName: ELimitsStateNames;
    nodeId: number | null;
    pages?: number;
    variables?: TDictionary;
  };

  type TCheckedRows<M extends IModel = IModel> = Partial<{
    /**
     * Счетчик выделенных элементов
     */
    treeCounter: TreeCounter;

    /**
     * InnerName выбранных элементов
     */
    keys: number[] | string[];

    /**
     * Модели выбранных элементов
     */
    models: (M | RestModel)[];

    /**
     * Модели тех выбранных элементов, у которых нет выбранных родителей
     */
    shellModels: (M | RestModel)[];

    /**
     * InnerName`ы для shellModels
     */
    shellKeys: string[];

    /**
     * Модели всех выбранных элементов, в т.ч которые не видны пользователю
     */
    accumulatedModels: (M | RestModel)[];

    /**
     * InnerName`ы для accumulatedModels
     */
    accumulatedKeys: string[];
  }>;

  type TExcludeClearDataKeys = (
    | "checkedState"
    | "expandedState"
    | "searchValue"
  )[];
}

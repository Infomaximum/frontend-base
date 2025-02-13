import { type IReactionDisposer, reaction } from "mobx";
import { useCallback, useRef } from "react";
import { useUnmountEffect } from "./useUnmountEffect";
import type { FiltersStore } from "../../utils";

/**
 * Callback, который будет вызываться, при каждом изменении значений фильтров
 */
type TFiltersEffect = () => void;

/**
 * Реакция для оповещения об изменении фильтров
 * @param {TFiltersEffect} callback
 * @param {FiltersStore} filtersStore
 */
export const filterSubscribeReaction = (callback: TFiltersEffect, filtersStore: FiltersStore) =>
  reaction(() => {
    return filtersStore.filters.toJSON();
  }, callback);

/**
 * Метод подписки на изменения значений фильтра.
 * В качестве параметра принимает функцию, которая будет вызываться,
 * при каждом изменении значений фильтров
 */
export type TFiltersSubscribe = (effect: TFiltersEffect) => void;

export const useFiltersSubscribe = (filtersStore: TNullable<FiltersStore>): TFiltersSubscribe => {
  const reactionDisposers = useRef<IReactionDisposer[]>([]);

  // Отменяет все подписки на изменение фильтров, созданные в компоненте
  useUnmountEffect(() => {
    reactionDisposers.current.forEach((disposer) => {
      disposer();
    });
  });

  const subscribeFilters = useCallback(
    (effect: TFiltersEffect) => {
      if (filtersStore) {
        reactionDisposers.current.push(filterSubscribeReaction(effect, filtersStore));
      }
    },
    [filtersStore]
  );

  return subscribeFilters;
};

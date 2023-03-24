import type { Blocker, History, Transition } from "history";
import { type ContextType, useContext, useEffect } from "react";
import {
  type Navigator as BaseNavigator,
  UNSAFE_NavigationContext as NavigationContext,
} from "react-router-dom";

interface INavigator extends BaseNavigator {
  block: History["block"];
}

type TNavigationContextWithBlock = ContextType<typeof NavigationContext> & {
  navigator: INavigator;
};

// todo: Виктор Пименов: избавиться от кода, после добавления функционала в react-router
/**
 * @source https://github.com/remix-run/react-router/commit/256cad70d3fd4500b1abcfea66f3ee622fb90874
 */
export function useBlocker(blocker: Blocker, when = true) {
  const { navigator } = useContext(NavigationContext) as TNavigationContextWithBlock;

  useEffect(() => {
    if (!when) {
      return;
    }

    const unblock = navigator.block((tx: Transition) => {
      const autoUnblockingTx = {
        ...tx,
        retry() {
          // Automatically unblock the transition so it can play all the way
          // through before retrying it. TODO: Figure out how to re-enable
          // this block if the transition is cancelled for some reason.
          unblock();
          tx.retry();
        },
      };

      blocker(autoUnblockingTx);
    });

    return unblock;
  }, [navigator, blocker, when]);
}

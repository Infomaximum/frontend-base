import type { Model } from "@im/models";
import type { TLocalizationDescription } from "@im/utils";
import type { Store } from "src/utils/Store/Store/Store";

export type TParams = {
  displayModelNameInTitle?: boolean;
  titleLocList?: TLocalizationDescription[];
  store?: Store<Model>;
};

export interface IWithSystemTitleProps {
  setCustomSystemTitle(title: string): void;
  buildSystemTitle(titleList: string[]): void;
}

export interface IWithSystemTitleState {
  isCustomTitle: boolean;
}

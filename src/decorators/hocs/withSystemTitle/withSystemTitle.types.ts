import type { Model } from "@infomaximum/graphql-model";
import type { TLocalizationDescription } from "@infomaximum/localization";
import type { Store } from "../../../utils/Store/Store/Store";

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

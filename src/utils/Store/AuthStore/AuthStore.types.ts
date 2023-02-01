import type { DocumentNode } from "graphql";
import type { Location, NavigateFunction } from "react-router";
import type { NBaseStore } from "../BaseStore/BaseStore.types";

export declare namespace NAuthStore {
  interface IAuthStoreParams extends NBaseStore.IBaseStoreParams {
    getCurrentUserInfo: () => {
      id: number | null;
      isAuthorized: boolean;
    };

    getHistory: () => {
      location: Location;
      navigate: NavigateFunction;
    };
  }

  type TRequestSessionParams = {
    login: string;
    passwordHash: string;
    isLogonTypeEmail?: boolean;
  };

  type TSubmitDataParams = {
    mutation: DocumentNode;
    variables?: TDictionary;
    isSaveError?: boolean;
  };

  type TLogoutParams = {
    isClearAllData: boolean;
    isSaveBackPath: boolean;
    redirectPath?: string;
    locationState?: TDictionary;
  };
}

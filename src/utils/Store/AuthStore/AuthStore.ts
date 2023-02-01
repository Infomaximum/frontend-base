import { action, computed, makeObservable, observable } from "mobx";
import type { NAuthStore } from "./AuthStore.types";
import { logonMutation } from "./mutations/logonMutation";
import { get } from "lodash";
import { cookies } from "@im/utils";
import type { NCore } from "@im/core";
import { logoutMutation } from "./mutations/logoutMutation";
import { BaseStore } from "../BaseStore/BaseStore";
import { EErrorCode, TOKEN_NAME_COOKIE } from "../../const";
import type { NRequests } from "../../Requests/Requests.types";
import { BaseRequest } from "../../Requests/BaseRequest/BaseRequest";
import { BaseErrorHandler } from "../../ErrorHandlers/BaseErrorHandler/BaseErrorHandler";
import { loginPath, rootPath } from "../../Routes/paths";
import {
  assertSilent,
  getPathToLocalStorage,
  isAuthorizationPath,
  setPathToLocalStorage,
  Store,
} from "../../..";

type TPrivateFieldsAuthStore =
  | "_session"
  | "receiveSession"
  | "_error"
  | "receiveError"
  | "_submitting"
  | "setSubmitting"
  | "_isManualLogout";

export class AuthStore extends BaseStore {
  private static readonly authStatus = {
    SUCCESS: "SUCCESS",
    DISABLED_LOGON: "DISABLED_LOGON",
    EXPIRED_PASSWORD: "EXPIRED_PASSWORD",
    INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
    INVALID_LOGON_AND_MAX_LOGON_ATTEMPTS_EXCEED:
      "INVALID_LOGON_AND_MAX_LOGON_ATTEMPTS_EXCEED",
  };

  private static readonly authStatusToError = {
    [AuthStore.authStatus.DISABLED_LOGON]: EErrorCode.DISABLED_LOGON,
    [AuthStore.authStatus.EXPIRED_PASSWORD]: EErrorCode.EXPIRED_PASSWORD,
    [AuthStore.authStatus.INVALID_CREDENTIALS]: EErrorCode.INVALID_CREDENTIALS,
    [AuthStore.authStatus.INVALID_LOGON_AND_MAX_LOGON_ATTEMPTS_EXCEED]:
      EErrorCode.INVALID_LOGON_AND_MAX_LOGON_ATTEMPTS_EXCEED,
  };

  private _session: string | undefined = undefined;
  private _error: NCore.TError | undefined = undefined;
  private _isManualLogout = false;
  private _submitting = false;

  private getCurrentUserInfo: NAuthStore.IAuthStoreParams["getCurrentUserInfo"];
  private getHistory: NAuthStore.IAuthStoreParams["getHistory"];

  private requestInstance: NRequests.IRequest;

  constructor(params: NAuthStore.IAuthStoreParams) {
    super({ name: params.name });

    makeObservable<this, TPrivateFieldsAuthStore>(this, {
      _session: observable,
      _error: observable,
      _submitting: observable,
      _isManualLogout: observable,
      setManualLogoutState: action.bound,
      setSubmitting: action.bound,
      requestSession: action.bound,
      receiveSession: action.bound,
      receiveError: action.bound,
      cleanError: action.bound,
      reset: action.bound,
      session: computed,
      error: computed,
      isManualLogout: computed,
    });

    this.getCurrentUserInfo = params.getCurrentUserInfo;
    this.getHistory = params.getHistory;

    this.requestInstance = new BaseRequest({
      errorHandlerInstance: new BaseErrorHandler(),
    });
  }
  //----------------------------------------COMPUTED------------------------------------//

  public get session() {
    return this._session;
  }

  public get error(): NCore.TError | undefined {
    return this._error;
  }

  public get submitting() {
    return this._submitting;
  }

  /** Выход из системы был сделан самостоятельно? */
  public get isManualLogout() {
    return this._isManualLogout;
  }

  //----------------------------------------ACTIONS------------------------------------//

  /** Выход из системы в ручном режиме */
  public setManualLogoutState(isManualLogout: boolean) {
    this._isManualLogout = isManualLogout;
  }

  public setSubmitting(isSubmitting: boolean) {
    this._submitting = isSubmitting;
  }

  public receiveError(error: any) {
    this._error = error;
  }

  protected receiveSession(data: TDictionary | null) {
    const session = get(data, "logon.uuid") as string | undefined;

    this._session = session;

    cookies.set(TOKEN_NAME_COOKIE, session, { path: rootPath });
  }

  public cleanError() {
    this._error = undefined;
  }

  public async requestSession({
    login,
    passwordHash,
    isLogonTypeEmail,
  }: NAuthStore.TRequestSessionParams) {
    let data: TDictionary | null;
    this.setSubmitting(true);

    try {
      data = await this.requestInstance.submitData({
        mutation: logonMutation,
        variables: {
          login,
          passwordHash,
        },
      });

      this.setManualLogoutState(false);

      const status = get(data, "logon.status");

      if (status !== AuthStore.authStatus.SUCCESS) {
        const errorFromStatus = AuthStore.authStatusToError[status] || status;
        throw {
          code: errorFromStatus,
          params: {
            isLogonTypeEmail,
          },
        };
      }

      const employeeId = get(data, "logon.employee.id");
      if (employeeId && this.getCurrentUserInfo().id !== employeeId) {
        this.clearAllData();
      }

      this.receiveSession(data);
    } catch (error) {
      this.receiveError(error);

      throw error;
    } finally {
      this.setSubmitting(false);
    }
  }

  /** Подготавливает данные для мутации на сервер и обрабатывает ответ */
  public async submitData<Data = any>({
    mutation,
    variables,
    isSaveError = true,
  }: NAuthStore.TSubmitDataParams): Promise<Data | null> {
    let data: Data | null;

    try {
      data = await this.requestInstance.submitData<Data>({
        mutation,
        variables,
      });
    } catch (error) {
      if (isSaveError) {
        this.receiveError(error);
      }

      throw error;
    }

    return data;
  }

  /**
   * Выполняет выход их системы
   * @param isClearAllData - очистить ли все сторы перед выходом
   * @param isSaveBackPath - сохранять ли путь с которого выкидывает в localStorage перед выходом (по умолчанию записывается rootPath)
   */
  public async logout({
    isClearAllData,
    isSaveBackPath,
    redirectPath,
    locationState,
  }: NAuthStore.TLogoutParams) {
    const {
      navigate,
      location: { pathname },
    } = this.getHistory();

    const savedPath = isSaveBackPath ? pathname : rootPath;

    try {
      // Важно, чтобы удалении сесии было до отправки мутации на логаут (в противном случае, мутации могут зациклиться)
      cookies.remove(TOKEN_NAME_COOKIE, { path: rootPath });

      if (this.getCurrentUserInfo().isAuthorized) {
        await this.submitData({
          mutation: logoutMutation,
          isSaveError: false,
        });
      }
    } catch (error) {
      // ничего не делаем, сессия на клиенте все равно удалится, вне зависимости от ошибок с сервера
      assertSilent(false, `Ошибка ${JSON.stringify(error)}`);
    } finally {
      AuthStore.registrationStores.forEach((store) => {
        if (store instanceof Store && store.isSubscribed) {
          store.unsubscribe();
        }
      });

      if (isClearAllData) {
        this.clearAllData();
      }

      if (!isAuthorizationPath(savedPath)) {
        setPathToLocalStorage(savedPath);
      }

      this.cleanError();

      navigate?.(redirectPath || loginPath, { state: locationState });
    }
  }

  public clearAllData() {
    AuthStore.registrationStores.forEach((store) => {
      store.reset?.();
    });

    // Необходимо очищать весь localStorage кроме пути, т.к. он используется, после авторизации
    const savedPath = getPathToLocalStorage();
    localStorage.clear();
    if (savedPath) {
      setPathToLocalStorage(savedPath);
    }
  }

  public reset() {
    this.setManualLogoutState(false);
    this.cleanError();
    this._session = undefined;
  }
}

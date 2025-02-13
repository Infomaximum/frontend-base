import type { NavigateFunction, Location } from "react-router";
import { assertSimple } from "@infomaximum/assert";
import { getApiPrefix, getBasePrefix } from "../../URI/URI";

type TLocationChangeListener = (location: Location) => void;

export class HistoryStore {
  private _navigate?: NavigateFunction;
  private _location?: Location;
  private _locationChangeListeners: TLocationChangeListener[] = [];

  private _basename: string;

  private static getBasename() {
    const apiPrefix = getApiPrefix();
    const basePrefix = getBasePrefix();

    return apiPrefix ? `${apiPrefix}${basePrefix}` : basePrefix;
  }

  constructor() {
    this._basename = HistoryStore.getBasename();
  }

  public get location() {
    assertSimple(!!this._location, "Объект location не инициализирован в historyStore");

    return this._location;
  }

  public set location(location: Location) {
    this._locationChangeListeners.forEach((listener) => listener(location));
    this._location = location;
  }

  public get navigate() {
    assertSimple(!!this._navigate, "Метод navigate не инициализирован в historyStore");

    return this._navigate;
  }

  public set navigate(navigate: NavigateFunction) {
    this._navigate = navigate;
  }

  public get basename() {
    return this._basename;
  }

  public listenLocationChange(listener: TLocationChangeListener) {
    this._locationChangeListeners.push(listener);

    return () => {
      this._locationChangeListeners.filter((_listener) => _listener !== listener);
    };
  }
}

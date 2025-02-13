import {
  savePathToSessionStorage,
  setPathToSessionStorage,
  getPathToSessionStorage,
  removePathToSessionStorage,
  contains,
  getBasePrefix,
} from "./URI";

describe("Тест файла URI", () => {
  it("Тестирование функции savePathToSessionStorage", () => {
    const key = "currentPath";

    savePathToSessionStorage();
    expect(sessionStorage.getItem(key)).toBe("/");
    sessionStorage.removeItem(key);
  });

  it("Тестирование функции setPathToSessionStorage", () => {
    const key = "currentPath";

    setPathToSessionStorage(getBasePrefix());
    expect(sessionStorage.getItem(key)).toBe(getBasePrefix());
    sessionStorage.removeItem(key);
  });

  it("Тестирование функции getPathToSessionStorage", () => {
    const path = "/apps";
    const key = "currentPath";

    sessionStorage.setItem(key, path);
    expect(getPathToSessionStorage()).toBe(path);
    sessionStorage.removeItem(key);
  });

  it("Тестирование функции removePathToSessionStorage", () => {
    const path = "/apps";
    const key = "currentPath";

    sessionStorage.setItem(key, path);
    removePathToSessionStorage();

    expect(sessionStorage.getItem(key)).toBe(null);
  });

  it("Тестирование функции contains", () => {
    const rootURI = `${getBasePrefix()}/settings/some`;
    const childURI = "some";

    expect(contains(rootURI, childURI)).toBe(true);
    expect(contains(rootURI, "asdf")).toBe(false);
  });
});

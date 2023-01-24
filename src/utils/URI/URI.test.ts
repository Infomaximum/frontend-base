import {
  savePathToLocalStorage,
  setPathToLocalStorage,
  getPathToLocalStorage,
  removePathToLocalStorage,
  contains,
  getBasePrefix,
} from "./URI";

describe("Тест файла URI", () => {
  it("Тестирование функции savePathToLocalStorage", () => {
    const key = "currentPath";

    savePathToLocalStorage();
    expect(localStorage.getItem(key)).toBe("/");
    localStorage.removeItem(key);
  });

  it("Тестирование функции setPathToLocalStorage", () => {
    const key = "currentPath";

    setPathToLocalStorage(getBasePrefix());
    expect(localStorage.getItem(key)).toBe(getBasePrefix());
    localStorage.removeItem(key);
  });

  it("Тестирование функции getPathToLocalStorage", () => {
    const path = "/apps";
    const key = "currentPath";

    localStorage.setItem(key, path);
    expect(getPathToLocalStorage()).toBe(path);
    localStorage.removeItem(key);
  });

  it("Тестирование функции removePathToLocalStorage", () => {
    const path = "/apps";
    const key = "currentPath";

    localStorage.setItem(key, path);
    removePathToLocalStorage();

    expect(localStorage.getItem(key)).toBe(null);
  });

  it("Тестирование функции contains", () => {
    const rootURI = `${getBasePrefix()}/settings/some`;
    const childURI = "some";

    expect(contains(rootURI, childURI)).toBe(true);
    expect(contains(rootURI, "asdf")).toBe(false);
  });
});

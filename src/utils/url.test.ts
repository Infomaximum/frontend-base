import { SearchParamAccessor } from "./url";

describe("SearchParamAccessor", () => {
  it("Добавление нового параметра происходит корректно", async () => {
    const search = "";
    expect(await SearchParamAccessor.set(search, "a", "1")).toEqual(`?a=1`);
  });

  it("Добавление параметра происходит корректно", async () => {
    const search = "?a=1&b=2";
    expect(await SearchParamAccessor.set(search, "c", "3")).toEqual(`${search}&c=3`);
  });

  it("Добавление нескольких параметров происходит корректно", async () => {
    const search = "?a=1";
    expect(
      await SearchParamAccessor.set(search, [
        ["b", "2"],
        ["c", "3"],
      ])
    ).toEqual(`${search}&b=2&c=3`);
  });

  it("Замена параметра происходит корректно", async () => {
    const search = "?a=1&b=2";
    expect(await SearchParamAccessor.set(search, "b", "3")).toEqual(`?a=1&b=3`);
  });

  it("Удаление параметра происходит корректно", async () => {
    const search = "?a=1&b=2";
    expect(await SearchParamAccessor.set(search, "b", "")).toEqual(`?a=1`);
  });

  it("Удаление всех параметров происходит корректно", async () => {
    const search = "?a=1&b=2";
    expect(
      await SearchParamAccessor.set(search, [
        ["a", ""],
        ["b", ""],
      ])
    ).toEqual("");
  });

  it("Получение параметра происходит корректно", async () => {
    const search = "?a=1&b=2";
    expect(await SearchParamAccessor.get(search, "b")).toEqual("2");
  });
});

import { renderHook } from "@testing-library/react";
import { useSystemLoaderControl } from "./useSystemLoaderControl";
import {
  SystemLoaderContext,
  type TSystemLoaderContextValue,
} from "@infomaximum/base/src/decorators/contexts/SystemLoaderContext";
import type { FC, ReactNode } from "react";
import { type Model, RestModel } from "@infomaximum/base/src/models";
import { InvalidIndex } from "@infomaximum/utility";
import type { NCore } from "@infomaximum/base/src/libs/core";

type TTestWrapperComponentProps = {
  children: ReactNode;
};

const contextValueMock = {
  hideSystemLoader: jest.fn(),
  isLoading: jest.fn(),
  showSystemLoader: jest.fn(),
} satisfies TSystemLoaderContextValue;

const model = new RestModel({
  struct: { id: InvalidIndex, __typename: RestModel.typename },
  parent: {} as Model,
});

const TestWrapperComponent: FC<TTestWrapperComponentProps> = ({ children }) => {
  return (
    <SystemLoaderContext.Provider value={contextValueMock}>{children}</SystemLoaderContext.Provider>
  );
};

describe("useSystemLoaderControl", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("При переданном состоянии загрузки, хук возвращает правильное состояния загруженности", () => {
    const { rerender, result } = renderHook(useSystemLoaderControl, {
      wrapper: TestWrapperComponent,
      initialProps: true,
    });

    expect(result.current).toEqual(false);

    rerender(false);

    expect(result.current).toEqual(true);
  });

  test("При монтировании showSystemLoader вызывается 1 раз", () => {
    renderHook(useSystemLoaderControl, {
      wrapper: TestWrapperComponent,
      initialProps: true,
    });

    expect(contextValueMock.showSystemLoader).toHaveBeenCalledTimes(1);
  });

  test("При монтировании showSystemLoader не вызывается, если изначально состояние isLoading = false", () => {
    renderHook(useSystemLoaderControl, {
      wrapper: TestWrapperComponent,
      initialProps: false,
    });

    expect(contextValueMock.showSystemLoader).not.toHaveBeenCalled();
  });

  test("При изменении флаг isLoading с true -> false, происходит вызов hideSystemLoader и хук возвращает true", () => {
    const { result, rerender } = renderHook(useSystemLoaderControl, {
      wrapper: TestWrapperComponent,
      initialProps: true,
    });

    expect(result.current).toEqual(false);

    rerender(false);

    expect(result.current).toEqual(true);

    expect(contextValueMock.hideSystemLoader).toHaveBeenCalledTimes(1);
  });

  test("Если условия загрузки повторно === true, то showSystemLoader вызван не будет", () => {
    const { rerender } = renderHook(useSystemLoaderControl, {
      wrapper: TestWrapperComponent,
      initialProps: true,
    });

    contextValueMock.showSystemLoader.mockClear();

    rerender(false);

    expect(contextValueMock.showSystemLoader).not.toHaveBeenCalled();

    rerender(true);

    expect(contextValueMock.showSystemLoader).not.toHaveBeenCalled();
  });

  test("После перехода состояния false -> true -> false, hideSystemLoader не вызывается", () => {
    const { rerender } = renderHook(useSystemLoaderControl, {
      wrapper: TestWrapperComponent,
      initialProps: false,
    });

    rerender(true);

    contextValueMock.hideSystemLoader.mockClear();

    rerender(false);

    expect(contextValueMock.hideSystemLoader).not.toHaveBeenCalled();
  });

  test("После перехода состояния false -> true, showSystemLoader не вызывается", () => {
    const { rerender } = renderHook(useSystemLoaderControl, {
      wrapper: TestWrapperComponent,
      initialProps: false,
    });

    contextValueMock.showSystemLoader.mockClear();

    rerender(true);

    expect(contextValueMock.showSystemLoader).not.toHaveBeenCalled();
  });

  test("Проверка передачи стора в хук", () => {
    const { result, rerender } = renderHook<
      boolean,
      { model: Model | null; error: NCore.TError | null; isDataLoaded: boolean }
    >(useSystemLoaderControl, {
      wrapper: TestWrapperComponent,
      initialProps: { model: null, error: null, isDataLoaded: false },
    });

    // стор не заполнен (Монтирование)
    expect(result.current).toEqual(false);
    expect(contextValueMock.showSystemLoader).toHaveBeenCalled();
    expect(contextValueMock.hideSystemLoader).not.toHaveBeenCalled();

    contextValueMock.showSystemLoader.mockClear();
    contextValueMock.hideSystemLoader.mockClear();

    rerender({ model: null, error: { code: "fail" }, isDataLoaded: true });

    // ререндерр, данные загружены, в сторе ошибка
    expect(result.current).toEqual(false);
    expect(contextValueMock.showSystemLoader).not.toHaveBeenCalled();
    expect(contextValueMock.hideSystemLoader).toHaveBeenCalled();

    contextValueMock.showSystemLoader.mockClear();
    contextValueMock.hideSystemLoader.mockClear();

    rerender({ model: model, error: null, isDataLoaded: true });

    // ререндер, данные загружены, в сторе модель
    expect(result.current).toEqual(true);
    expect(contextValueMock.showSystemLoader).not.toHaveBeenCalled();
    expect(contextValueMock.hideSystemLoader).not.toHaveBeenCalled();
  });

  test("Проверка передачи стора в хук Монтирование без данных и  последующее наполнение стора", () => {
    const { result, rerender } = renderHook<
      boolean,
      { model: Model | null; error: NCore.TError | null; isDataLoaded: boolean }
    >(useSystemLoaderControl, {
      wrapper: TestWrapperComponent,
      initialProps: { model: null, error: null, isDataLoaded: false },
    });

    // стор не заполнен (Монтирование)
    expect(result.current).toEqual(false);
    expect(contextValueMock.showSystemLoader).toHaveBeenCalled();
    expect(contextValueMock.hideSystemLoader).not.toHaveBeenCalled();

    contextValueMock.showSystemLoader.mockClear();
    contextValueMock.hideSystemLoader.mockClear();

    rerender({ model: model, error: null, isDataLoaded: true });

    // ререндер, данные загружены, в сторе модель
    expect(result.current).toEqual(true);
    expect(contextValueMock.showSystemLoader).not.toHaveBeenCalled();
    expect(contextValueMock.hideSystemLoader).toHaveBeenCalled();
  });
});

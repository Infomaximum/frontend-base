import React, { useContext, useId, useLayoutEffect, type FC } from "react";
import { render, act, screen, fireEvent } from "@testing-library/react";
import { SystemLoaderProvider } from "./SystemLoaderProvider";
import { SystemLoaderContext } from "@infomaximum/base/src/decorators/contexts/SystemLoaderContext";
import { wrapperGlobalSpinnerTestId } from "@infomaximum/base/src/utils/TestIds";
import type { TSystemLoaderProviderExternalHandlers } from "./SystemLoaderProvider.types";

const mockSystemLoaderContext = {
  isLoading: jest.fn(() => false),
  showSystemLoader: jest.fn(),
  hideSystemLoader: jest.fn(),
  onLoadingChange: jest.fn(),
};

type TRefMock = {
  current: TSystemLoaderProviderExternalHandlers;
};

describe("SystemLoaderProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("SystemLoaderProvider внутреннее управление состоянием загрузки", () => {
    test("Контент отображается даже если идет загрузка (но скрыт visibility: hidden)", /**
     * Контент просто визуально скрываем, оставляя его в DOM чтобы к тому моменту когда все провайдеры
     * сообщат о своей готовности к отображению не было скачков контента
     */ () => {
      const childContent = "Child Content";

      render(
        <SystemLoaderContext.Provider value={mockSystemLoaderContext}>
          <SystemLoaderProvider>
            <div>{childContent}</div>
          </SystemLoaderProvider>
        </SystemLoaderContext.Provider>
      );

      expect(screen.getByText(childContent)).toBeInTheDocument();
    });

    test("При монтировании провайдера loading=true", /**
     * Важно, чтобы при монтировании провайдера состояние загрузки было true
     */ () => {
      const refMock = { current: null } as unknown as TRefMock;

      render(
        <SystemLoaderProvider ref={refMock}>
          <div>Child Content</div>
        </SystemLoaderProvider>
      );

      expect(refMock.current.isLoading()).toEqual(true);
    });

    test("Множество вызовов hideSystemLoader не приводит к 'зависанию' спиннера", () => {
      const refMock = { current: null } as unknown as TRefMock;

      render(
        <SystemLoaderContext.Provider value={mockSystemLoaderContext}>
          <SystemLoaderProvider>
            <SystemLoaderProvider ref={refMock}>
              <div>Child Content</div>
            </SystemLoaderProvider>
          </SystemLoaderProvider>
        </SystemLoaderContext.Provider>
      );

      expect(screen.queryByTestId(wrapperGlobalSpinnerTestId)).toBeInTheDocument();

      act(() => {
        Array.from({ length: 10 }).forEach(() => {
          refMock.current.hideSystemLoader();
        });
      });

      expect(screen.queryByTestId(wrapperGlobalSpinnerTestId)).not.toBeInTheDocument();
    });

    test("Чтобы спрятать спиннер, неважно сколько вызовов было showSystemLoader один вызов hideSystemLoader скрывает спиннер", () => {
      const refMock = { current: null } as unknown as TRefMock;

      render(
        <SystemLoaderContext.Provider value={mockSystemLoaderContext}>
          <SystemLoaderProvider ref={refMock}>
            <div>Child Content</div>
          </SystemLoaderProvider>
        </SystemLoaderContext.Provider>
      );

      expect(screen.queryByTestId(wrapperGlobalSpinnerTestId)).toBeInTheDocument();

      act(() => {
        Array.from({ length: 10 }).forEach(() => {
          refMock.current.showSystemLoader();
        });
      });

      act(() => {
        refMock.current.hideSystemLoader();
      });

      expect(screen.queryByTestId(wrapperGlobalSpinnerTestId)).not.toBeInTheDocument();
    });

    test("При отображении лоадера у родителя, дочерний провайдер не отображает лоадер", /**
     * Нет смысла отображать спиннеры у детей, если спиннер уже отображается у родителя и перекрывает контент детей
     */ () => {
      const refParentMock = { current: null } as unknown as TRefMock;
      const refChildMock = { current: null } as unknown as TRefMock;

      const childAttributes = { "test-id": "child-wrapper" };
      const parentAttributes = { "test-id": "parent-wrapper" };

      render(
        <SystemLoaderContext.Provider value={mockSystemLoaderContext}>
          <div {...parentAttributes}>
            <SystemLoaderProvider ref={refParentMock}>
              <div {...childAttributes}>
                <SystemLoaderProvider ref={refChildMock}>
                  <div>Child Content</div>
                </SystemLoaderProvider>
              </div>
            </SystemLoaderProvider>
          </div>
        </SystemLoaderContext.Provider>
      );

      const spinnerInParentProvider = getFirstChildSpinnerElement(
        screen.getByTestId(parentAttributes["test-id"])
      );

      const spinnerInChildProvider = getFirstChildSpinnerElement(
        screen.getByTestId(childAttributes["test-id"])
      );

      expect(spinnerInParentProvider).toBeInTheDocument();
      expect(spinnerInChildProvider).not.toBeInTheDocument();
    });

    test("При скрытии лоадера провайдера вручную, лоадеры начинают отображаться у дочерних провайдеров", () => {
      const refParentMock = { current: null } as unknown as TRefMock;
      const refChildMock = { current: null } as unknown as TRefMock;

      const childAttributes = { "test-id": "child-wrapper" };
      const parentAttributes = { "test-id": "parent-wrapper" };

      render(
        <SystemLoaderContext.Provider value={mockSystemLoaderContext}>
          <div {...parentAttributes}>
            <SystemLoaderProvider ref={refParentMock}>
              <div {...childAttributes}>
                <SystemLoaderProvider ref={refChildMock}>
                  <div>Child Content</div>
                </SystemLoaderProvider>
              </div>
            </SystemLoaderProvider>
          </div>
        </SystemLoaderContext.Provider>
      );

      const getSpinnerInParentProvider = () =>
        getFirstChildSpinnerElement(screen.getByTestId(parentAttributes["test-id"]));

      const getSpinnerInChildProvider = () =>
        getFirstChildSpinnerElement(screen.getByTestId(childAttributes["test-id"]));

      expect(getSpinnerInParentProvider()).toBeInTheDocument();
      expect(getSpinnerInChildProvider()).not.toBeInTheDocument();

      act(() => {
        refParentMock.current.hideSystemLoader();
      });

      expect(getSpinnerInParentProvider()).not.toBeInTheDocument();
      expect(getSpinnerInChildProvider()).toBeInTheDocument();
    });

    test("После вызова hideSystemLoader загрузка внутри провайдера прекращается, происходит вызов hideSystemLoader из родительского контекста", /**
     * После того как провайдер завершил подготовку для отображения, то он сообщает родительскому провайдеру что он готов для отображения
     */ () => {
      const refMock = { current: null } as unknown as TRefMock;

      render(
        <SystemLoaderContext.Provider value={mockSystemLoaderContext}>
          <SystemLoaderProvider ref={refMock}>
            <div>Child Content</div>
          </SystemLoaderProvider>
        </SystemLoaderContext.Provider>
      );

      expect(refMock.current.isLoading()).toEqual(true);

      act(() => {
        refMock.current.hideSystemLoader();
      });

      expect(refMock.current.isLoading()).toEqual(false);
      expect(mockSystemLoaderContext.hideSystemLoader).toHaveBeenCalled();
      expect(screen.queryByTestId(wrapperGlobalSpinnerTestId)).not.toBeInTheDocument();
    });

    test("У родительского провайдера перестает отображаться спиннер только если все дочерние вызвали метод hideSystemLoader", () => {
      const refMockRootProvider = { current: null } as unknown as TRefMock;
      const refMock1 = { current: null } as unknown as TRefMock;
      const refMock11 = { current: null } as unknown as TRefMock;
      const refMock2 = { current: null } as unknown as TRefMock;
      const refMock3 = { current: null } as unknown as TRefMock;

      render(
        <SystemLoaderProvider ref={refMockRootProvider}>
          <SystemLoaderProvider ref={refMock1}>
            <SystemLoaderProvider ref={refMock11}>
              <div>Child Content11</div>
            </SystemLoaderProvider>
          </SystemLoaderProvider>

          <SystemLoaderProvider ref={refMock2}>
            <div>Child Content2</div>
          </SystemLoaderProvider>

          <SystemLoaderProvider ref={refMock3}>
            <div>Child Content3</div>
          </SystemLoaderProvider>
        </SystemLoaderProvider>
      );

      const allRefs = [refMockRootProvider, refMock1, refMock11, refMock2, refMock3];

      allRefs.forEach((ref) => {
        expect(ref.current.isLoading()).toEqual(true);
      });

      act(() => {
        refMock2.current.hideSystemLoader();
        refMock3.current.hideSystemLoader();
      });

      [refMock2, refMock3].forEach((ref) => {
        expect(ref.current.isLoading()).toEqual(false);
      });

      [refMockRootProvider, refMock1, refMock11].forEach((ref) => {
        expect(ref.current.isLoading()).toEqual(true);
      });

      act(
        // скрываем руками у refMock11, и по цепочке вверх состояние загрузки отключается у всех провайдеров
        () => {
          refMock11.current.hideSystemLoader();
        }
      );

      allRefs.forEach((ref) => {
        expect(ref.current.isLoading()).toEqual(false);
      });
    });

    test("Если родитель загружается, то showSystemLoader вызывает каждый дочерний провайдер (только дети первого порядка)", () => {
      render(
        <SystemLoaderContext.Provider
          value={{ ...mockSystemLoaderContext, isLoading: jest.fn(() => true) }}
        >
          <SystemLoaderProvider>
            <SystemLoaderProvider>
              <div>Child Content11</div>
            </SystemLoaderProvider>
          </SystemLoaderProvider>

          <SystemLoaderProvider>
            <div>Child Content2</div>
          </SystemLoaderProvider>

          <SystemLoaderProvider>
            <div>Child Content3</div>
          </SystemLoaderProvider>
        </SystemLoaderContext.Provider>
      );

      expect(mockSystemLoaderContext.showSystemLoader).toHaveBeenCalledTimes(3);
    });

    test("Если родитель не загружается, то загрузка будет происходить только внутри дочерних провайдеров и не будет вызывать метод showSystemLoader у родителя", /**
     * Такая логика реализована, потому что, если какой то провайдер появляется динамически
     * (например выполнилось условие для отображения или используется ленивая загрузка контейнера с провайдером),
     * то это приведет к скрытию контента родительским провайдером. Сейчас же при монтировании
     * провайдера будет отображен спиннер непосредственно в нем, и он перекроет только свой вложенный контент
     */ () => {
      render(
        <SystemLoaderContext.Provider
          value={{ ...mockSystemLoaderContext, isLoading: jest.fn(() => false) }}
        >
          <SystemLoaderProvider>
            <SystemLoaderProvider>
              <div>Child Content11</div>
            </SystemLoaderProvider>
          </SystemLoaderProvider>

          <SystemLoaderProvider>
            <div>Child Content2</div>
          </SystemLoaderProvider>

          <SystemLoaderProvider>
            <div>Child Content3</div>
          </SystemLoaderProvider>
        </SystemLoaderContext.Provider>
      );

      expect(mockSystemLoaderContext.showSystemLoader).toHaveBeenCalledTimes(0);
    });

    test("При смене состояния загрузки вызывается метод onLoadingChange", () => {
      const handleLoadingChange = jest.fn();
      const refMock = { current: null } as unknown as TRefMock;

      render(
        <SystemLoaderProvider onLoadingChange={handleLoadingChange} ref={refMock}>
          <div>Child Content11</div>
        </SystemLoaderProvider>
      );

      expect(handleLoadingChange).toHaveBeenCalledWith(true);

      act(() => {
        refMock.current.hideSystemLoader();
      });

      expect(handleLoadingChange).toHaveBeenCalledWith(false);
    });

    test("После загрузки всех дочерних провайдеров происходит вызов метода onLoadingChange", () => {
      const handleLoadingChange = jest.fn();

      const refMock1 = { current: null } as unknown as TRefMock;
      const refMock2 = { current: null } as unknown as TRefMock;

      render(
        <SystemLoaderProvider onLoadingChange={handleLoadingChange}>
          <SystemLoaderProvider ref={refMock1}>
            <div>Child Content11</div>
          </SystemLoaderProvider>
          <SystemLoaderProvider ref={refMock2}>
            <div>Child Content11</div>
          </SystemLoaderProvider>
        </SystemLoaderProvider>
      );

      act(() => {
        refMock1.current.hideSystemLoader();
        refMock2.current.hideSystemLoader();
      });

      expect(handleLoadingChange).toHaveBeenCalledWith(false);
    });

    test("Вызов функции onLoadingChange происходит 2 раза (во время начала загрузки и при окончании) вне зависимости от количества дочерних провайдеров", () => {
      const handleLoadingChange = jest.fn();

      const refMock1 = { current: null } as unknown as TRefMock;
      const refMock2 = { current: null } as unknown as TRefMock;
      const refMock3 = { current: null } as unknown as TRefMock;

      render(
        <SystemLoaderProvider onLoadingChange={handleLoadingChange}>
          <SystemLoaderProvider ref={refMock1}>
            <div>Child Content11</div>
          </SystemLoaderProvider>
          <SystemLoaderProvider ref={refMock2}>
            <div>Child Content11</div>
          </SystemLoaderProvider>
          <SystemLoaderProvider ref={refMock3}>
            <div>Child Content11</div>
          </SystemLoaderProvider>
        </SystemLoaderProvider>
      );

      act(() => {
        refMock1.current.hideSystemLoader();
        refMock2.current.hideSystemLoader();
        refMock3.current.hideSystemLoader();
      });

      expect(handleLoadingChange).toHaveBeenCalledTimes(2);
    });

    test("Если единственный дочерний провайдер был отмонтирован, то загрузка родителя прекратится", () => {
      const refMock = { current: null } as unknown as TRefMock;

      const { rerender } = render(
        <SystemLoaderProvider key="test" ref={refMock}>
          <SystemLoaderProvider>
            <div>Child Content</div>
          </SystemLoaderProvider>
        </SystemLoaderProvider>
      );

      expect(refMock.current.isLoading()).toEqual(true);

      rerender(
        <SystemLoaderProvider key="test" ref={refMock}>
          Test
        </SystemLoaderProvider>
      );

      expect(refMock.current.isLoading()).toEqual(false);
    });

    test("При размонтировании провайдера hideSystemLoader вызывается", () => {
      const refMock = { current: null } as unknown as TRefMock;

      const { unmount } = render(
        <SystemLoaderContext.Provider value={mockSystemLoaderContext}>
          <SystemLoaderProvider key="test" ref={refMock}>
            <div>Child Content</div>
          </SystemLoaderProvider>
        </SystemLoaderContext.Provider>
      );

      unmount();

      expect(mockSystemLoaderContext.hideSystemLoader).toHaveBeenCalled();
    });

    test("Спиннер скрывается по таймауту, даже если загрузка не завершена", () => {
      jest.useFakeTimers();

      const { rerender } = render(
        <SystemLoaderContext.Provider value={mockSystemLoaderContext}>
          <SystemLoaderProvider timeout={5000}>
            <div>Content</div>
          </SystemLoaderProvider>
        </SystemLoaderContext.Provider>
      );

      expect(screen.queryByTestId(wrapperGlobalSpinnerTestId)).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      // Изменение контекста не перезапускает таймер
      rerender(
        <SystemLoaderContext.Provider
          value={{
            ...mockSystemLoaderContext,
            showSystemLoader: () => {},
          }}
        >
          <SystemLoaderProvider timeout={5000}>
            <div>Content</div>
          </SystemLoaderProvider>
        </SystemLoaderContext.Provider>
      );

      // Промежуточный контроль работоспособности теста
      expect(screen.queryByTestId(wrapperGlobalSpinnerTestId)).toBeInTheDocument();

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(screen.queryByTestId(wrapperGlobalSpinnerTestId)).not.toBeInTheDocument();

      jest.clearAllTimers();
    });

    test("Таймер со значением 0 срабатывает", () => {
      jest.useFakeTimers();

      render(
        <SystemLoaderContext.Provider value={mockSystemLoaderContext}>
          <SystemLoaderProvider timeout={0}>
            <div>Content</div>
          </SystemLoaderProvider>
        </SystemLoaderContext.Provider>
      );

      act(() => {
        jest.advanceTimersByTime(0);
      });

      expect(screen.queryByTestId(wrapperGlobalSpinnerTestId)).not.toBeInTheDocument();
    });

    test("Скрытие происходит если в hideSystemLoader передан id с которым был вызван showSystemLoader", () => {
      const refParentMock = { current: null } as unknown as TRefMock;
      const refChildMock = { current: null } as unknown as TRefMock;

      const TestComponent: FC = () => {
        const id = useId();

        const { showSystemLoader, hideSystemLoader } = useContext(SystemLoaderContext);

        useLayoutEffect(() => {
          showSystemLoader({ id });
        }, []);

        return (
          <>
            <button onClick={() => hideSystemLoader({ id: "b" })}>NO HIDE</button>

            <button onClick={() => hideSystemLoader({ id })}>HIDE</button>
          </>
        );
      };

      render(
        <SystemLoaderContext.Provider value={mockSystemLoaderContext}>
          <SystemLoaderProvider ref={refParentMock}>
            <SystemLoaderProvider ref={refChildMock}>
              <TestComponent />
            </SystemLoaderProvider>
          </SystemLoaderProvider>
        </SystemLoaderContext.Provider>
      );

      expect(refParentMock.current.isLoading()).toEqual(true);
      expect(refChildMock.current.isLoading()).toEqual(true);

      fireEvent.click(screen.getByText("NO HIDE"));

      expect(refParentMock.current.isLoading()).toEqual(true);
      expect(refChildMock.current.isLoading()).toEqual(true);

      fireEvent.click(screen.getByText("HIDE"));

      expect(refParentMock.current.isLoading()).toEqual(false);
      expect(refChildMock.current.isLoading()).toEqual(false);
      expect(mockSystemLoaderContext.hideSystemLoader).toHaveBeenCalled();
    });
  });
});

// -----------------------------------------HELPERS-------------------------------------

function getFirstChildSpinnerElement(parentElement: HTMLElement) {
  const firstLevelChildren = Array.from(parentElement.children);

  return (
    firstLevelChildren.find(
      (child) => child.getAttribute("test-id") === wrapperGlobalSpinnerTestId
    ) ?? null
  );
}

import type { ReactWrapper, ShallowWrapper } from "enzyme";
import { act } from "react";

/**
 * Ожидает отрисовки компонента с определенным таймаутом, полезно когда внутри компонента испольхуется
 * таймер в котором обновляется состояние
 */
export async function waitForComponentToPaint<P = unknown>(
  wrapper: ReactWrapper<P> | ShallowWrapper,
  amount = 0
) {
  jest.useRealTimers();

  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, amount));
    wrapper.update();
  });

  jest.useFakeTimers();
}

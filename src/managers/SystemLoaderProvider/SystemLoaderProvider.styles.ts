import { wrapperGlobalSpinnerStyle } from "@infomaximum/base/src/components/Spinner/GlobalSpinner/GlobalSpinner.styles";

export const getSystemLoaderProviderStyle = (isLoading: boolean) =>
  ({
    visibility: isLoading ? "hidden" : "visible",
    /**
     * У display: contents много проблем с доступностью элементов на которых он применен,
     * но в этом применении это не вызывает проблем, ведь обертка используется только чтобы временно
     * спрятать вложенный контент
     *
     * @link https://caniuse.com/css-display-contents
     */
    display: "contents",
  }) as const;

export const backgroundSpinnerStyle = (theme: TTheme) =>
  ({
    ...wrapperGlobalSpinnerStyle,
    /**
     * Решаемая проблема:
     * - Элементы с явно заданным `visibility: visible` будут отображаться несмотря на
     * visibility: hidden` родителя.
     *
     * Почему не подошли другие свойства для скрытия контента:
     * - display: none - мешает дочерним элементам измерить себя перед отображением.
     * - opacity: 0 - не работает с display: contents.
     * - height: 0 - не работает с display: contents.
     *
     * Было принято решение перекрывать контент с помощью background.
     */
    background: theme.grey4Color,
  }) as const;

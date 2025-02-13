export const tooltipOverlayStyle = (theme: TTheme) =>
  ({
    padding: "0 4px",
    maxWidth: `${theme.maxTooltipWidth}px`,
    // Чтобы тултип не мерцал при наведении на границу между сущностью и тултипом
    pointerEvents: "none",
  }) as const;

export const tooltipOverlayInnerStyle = (theme: TTheme) => ({
  padding: "2px 6px",
  minHeight: "22px",
  minWidth: "30px",
  fontSize: `${theme.h5FontSize}px`,
  lineHeight: "18px",
});

export const tooltipOverlayStyle = {
  maxWidth: "520px",
  // Чтобы тултип не мерцал при наведении на границу между сущностью и тултипом
  pointerEvents: "none",
} as const;

export const tooltipOverlayInnerStyle = (theme: TTheme) => ({
  padding: "2px 6px",
  minHeight: "20px",
  fontSize: `${theme.h5FontSize}px`,
  lineHeight: "18px",
});

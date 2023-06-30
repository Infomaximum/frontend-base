export const textOverflowStyle = {
  width: "100%",
  overflow: "hidden",
  whiteSpace: "nowrap",
} as const;

export const textOverflowOverlayStyle = (overlay: string) =>
  ({
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: "24px",
    // rgba(255, 255, 255, 0) необходимо для корректного отображения градиента в Safari
    backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0), ${overlay})`,
    pointerEvents: "none",
  } as const);

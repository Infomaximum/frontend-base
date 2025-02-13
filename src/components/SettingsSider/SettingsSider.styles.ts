import { scrollDefaultStyle } from "../../styles";
import { getFixedSizeByZoom } from "../../utils/zoom";

const hiddenScrollStyle = () =>
  ({
    "&": {
      "::-webkit-scrollbar": {
        display: "none",
      },
    },
    scrollbarWidth: "none",
    scrollBehavior: "smooth",
  }) as const;

export const getSiderStyle = (isShowScrollBar: boolean, zoomRatio: number) => (theme: TTheme) => {
  const scrollbarStyle = isShowScrollBar ? scrollDefaultStyle(theme) : hiddenScrollStyle();

  return {
    "&&": {
      background: "white",
      borderRight: `${getFixedSizeByZoom(1, zoomRatio)}px solid ${theme.grey45Color}`,
      padding: "4px 8px",
      overflowY: "auto",
    },
    overflowX: "hidden",
    height: "100%",
    ...scrollbarStyle,
  } as const;
};

export const siderContentWrapperStyle = {
  display: "flex",
  flexDirection: "column",
  marginRight: "8px",
  gap: "8px",
  ":last-of-type": { paddingBottom: "4px" },
  width: "244px",
  maxWidth: "244px",
  minWidth: "244px",
} as const;

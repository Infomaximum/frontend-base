import { type ThemeConfig } from "antd";
import type { AliasToken } from "antd/lib/theme/interface";
import { SYSTEM_FONT } from "../../utils";
import { theme } from "../../styles";

const color = {
  grey1Color: "#ffffff",
  grey2Color: "#fafafa",
  grey3Color: "#f5f5f5",
  grey4Color: "#f0f0f0",
  grey5Color: "#d9d9d9",
  grey6Color: "#bfbfbf",
  grey7Color: "#8c8c8c",
  grey8Color: "#595959",
  grey9Color: "#434343",
  grey10Color: "#262626",

  blue1Color: "#f0f8ff",
  blue2Color: "#d1e9ff",
  blue6Color: "#2667d1",

  red6Color: "#d93a36",
};

const activeShadows = {
  activeShadow: "0px 0px 4px 0px rgba(117, 170, 235, 0.5)",
  errorActiveShadow: "0px 0px 4px 0px rgba(217, 58, 54, 0.5)",
};

const colorPrimary = color.blue6Color;

const getScreen = () => {
  const screenXS = 480;
  const screenSM = 748;
  const screenMD = 972;
  const screenLG = 1260;
  const screenXL = 1516;
  const screenXXL = 1900;

  const screenXSMin = screenXS;
  const screenSMMin = screenSM;
  const screenMDMin = screenMD;
  const screenLGMin = screenLG;
  const screenXLMin = screenXL;
  const screenXXLMin = screenXXL;

  return {
    // Extra small screen / phone
    screenXS,
    screenXSMin,
    // Small screen / tablet
    screenSM,
    screenSMMin,
    // Medium screen / desktop
    screenMD,
    screenMDMin,
    // Large screen / wide desktop
    screenLG,
    screenLGMin,
    // Extra large screen / full hd
    screenXL,
    screenXLMin,
    // Extra extra large screen / large desktop
    screenXXL,
    screenXXLMin,
    // provide a maximum
    screenXSMax: screenSMMin - 1,
    screenSMMax: screenMDMin - 1,
    screenMDMax: screenLGMin - 1,
    screenLGMax: screenXLMin - 1,
    screenXLMax: screenXXLMin - 1,
  } satisfies Partial<AliasToken>;
};

const getToken = () => {
  const paddingXXS = 4;

  return {
    controlHeight: 28,

    paddingLG: 24,
    paddingMD: 16,
    paddingSM: 12,
    paddingXS: 8,
    paddingXXS,

    marginLG: 24,
    marginMD: 16,
    marginSM: 12,
    marginXS: 8,
    marginXXS: 4,

    controlPaddingHorizontal: 8,
    controlPaddingHorizontalSM: paddingXXS,

    blue1: color.blue1Color,
    blue2: color.blue2Color,
    blue6: color.blue6Color,

    red6: color.red6Color,

    colorPrimary: colorPrimary,
    colorTextDisabled: color.grey7Color,
    colorTextPlaceholder: color.grey6Color,
    colorError: color.red6Color,
    fontSize: 14,
    fontFamily: SYSTEM_FONT,
    borderRadius: 2,
    colorText: color.grey10Color,

    colorBgLayout: color.grey1Color,
    colorLink: colorPrimary,
    colorLinkHover: "#498af2",
    // --------------------------------------------------------
    ...getScreen(),
  } satisfies ThemeConfig["token"];
};

export const getThemeConfig = () => {
  const controlHeightBase = 28;
  const controlHeightLG = 40;

  return {
    token: getToken(),

    components: {
      Button: {
        defaultShadow: "none",
        primaryShadow: "none",
        dangerShadow: "none",
        borderColorDisabled: "none",
        paddingBlock: 3,
        paddingInline: 11,
        paddingBlockSM: 3,
        paddingInlineSM: 11,
        colorTextDisabled: color.grey6Color,
        lineHeight: 20,
        controlHeight: controlHeightBase,
        controlHeightLG: controlHeightLG,
        controlHeightSM: controlHeightBase,
        contentLineHeightSM: 1.5,
        contentLineHeight: 1.5,
      },
      Table: {
        headerBg: color.grey1Color,
        rowHoverBg: color.grey4Color,
        headerSortActiveBg: color.grey1Color,
        bodySortBg: color.grey1Color,
        fixedHeaderSortActiveBg: color.grey1Color,
        rowSelectedBg: color.blue1Color,
        rowSelectedHoverBg: color.blue2Color,
        headerSplitColor: "none",
        headerSortHoverBg: "none",
        cellPaddingBlockMD: 8,
      },
      Select: {
        multipleItemColorDisabled: color.grey6Color,
        optionHeight: 28,
        optionFontSize: 14,
        optionPadding: 3,
        optionSelectedFontWeight: 400,
        optionSelectedColor: theme.thrust5Color,
        optionSelectedBg: "transparent",
      },
      Input: {
        colorIconHover: color.grey10Color,
        paddingInline: 7,
        paddingInlineLG: 7,
        ...activeShadows,
      },
      Drawer: { footerPaddingBlock: 10, footerPaddingInline: 24 },
      InputNumber: {
        paddingInline: 7,
        paddingInlineSM: 7,
        paddingInlineLG: 7,
        ...activeShadows,
      },
      DatePicker: {
        paddingInlineLG: 7,
        paddingInline: 7,
        ...activeShadows,
      },
      Switch: { trackHeightSM: 16, trackMinWidthSM: 28, handleSizeSM: 12 },
      Popover: {
        boxShadowSecondary: "0 2px 8px 0px rgba(113, 113, 113, 0.2)",
      },
      Segmented: {
        trackBg: color.grey3Color,
        itemColor: color.grey10Color,
        itemSelectedColor: color.grey10Color,
        itemHoverColor: color.grey10Color,
        fontSize: 12,
      },
    },
  } satisfies ThemeConfig;
};

const colors = {
  /** =========================== Colors [START]  =========================== */
  transparentColor: "rgba(0, 0, 0, 0)",
  /** --------------------------------- Blue -------------------------------- */
  blue1Color: "#F0F8FF",
  blue2Color: "#D1E9FF",
  blue3Color: "#A3CCF7",
  blue4Color: "#75AAEB",
  blue5Color: "#4B88DE",
  blue6Color: "#2667D1",
  blue7Color: "#164AAB",
  blue8Color: "#0B3185",
  blue9Color: "#031D5E",
  blue10Color: "#010F38",
  /** --------------------------------- Azure -------------------------------- */
  azure1Color: "#4087F2",
  azure2Color: "#1C84FF",
  azure3Color: "#2248D9",

  /** --------------------------------- Grey -------------------------------- */
  grey1Color: "#FFFFFF",
  grey2Color: "#FAFAFA",
  grey3Color: "#F5F5F5",
  grey4Color: "#F0F0F0",
  grey45Color: "#E6E6E6",
  grey5Color: "#D9D9D9",
  grey6Color: "#BFBFBF",
  grey65Color: "#ABABAB",
  grey7Color: "#8C8C8C",
  grey75Color: "#737373",
  grey8Color: "#595959",
  grey9Color: "#434343",
  grey10Color: "#262626",
  grey11Color: "#1f1f1f",
  grey12Color: "#141414",
  grey13Color: "#000000",
  grey14Color: "#5F6E78",
  /** --------------------------------- Red -------------------------------- */
  red1Color: "#FFF3F0",
  red2Color: "#FFE7E3",
  red3Color: "#FFC2BA",
  red4Color: "#F2938A",
  red5Color: "#E6655E",
  red6Color: "#D93A36",
  red7Color: "#B32426",
  red8Color: "#8C151B",
  red9Color: "#660A12",
  red10Color: "#40060D",
  /** --------------------------------- Volcano -------------------------------- */
  volcano1Color: "#FFF2E8",
  volcano2Color: "#FFD8BF",
  volcano3Color: "#FFBB96",
  volcano4Color: "#FF9C6E",
  volcano5Color: "#FF7A45",
  volcano6Color: "#FA541C",
  volcano7Color: "#D4380D",
  volcano8Color: "#AD2102",
  volcano9Color: "#871400",
  /** --------------------------------- Yellow -------------------------------- */
  yellow1Color: "#FEFFE6",
  yellow2Color: "#FFFFB8",
  yellow3Color: "#FFFB8F",
  yellow4Color: "#FFF566",
  yellow5Color: "#FFD98C",
  yellow6Color: "#F6C33E",
  yellow7Color: "#E0A200",
  yellow8Color: "#AD8B00",
  yellow9Color: "#876800",
  yellow10Color: "#614700",
  /** --------------------------------- Orange -------------------------------- */
  orange1Color: "#FFF7E6",
  orange2Color: "#FFE7BA",
  orange3Color: "#FFD591",
  orange4Color: "#FFC069",
  orange5Color: "#FFA940",
  orange6Color: "#FA8C16",
  orange7Color: "#D46B08",
  orange8Color: "#AD4E00",
  orange9Color: "#873800",
  orange10Color: "#612500",
  orange11Color: "#FAF0D9",
  /** --------------------------------- Gold -------------------------------- */
  gold1Color: "#FFFBE6",
  gold2Color: "#FFF1B8",
  gold3Color: "#FFE58F",
  gold4Color: "#FFD666",
  gold5Color: "#FFC53D",
  gold6Color: "#FAAD14",
  gold7Color: "#D48806",
  gold8Color: "#AD6800",
  gold9Color: "#874D00",
  gold10Color: "#613400",
  /** --------------------------------- Green -------------------------------- */
  green1Color: "#E8F5E9",
  green2Color: "#C8E6C9",
  green3Color: "#A5D6A7",
  green4Color: "#81C784",
  green5Color: "#66BB6A",
  // цвет для иконки type="check"
  green6Color: "#4CAF50",
  green7Color: "#3F9142",
  green8Color: "#327334",
  green9Color: "#255426",
  green10Color: "#183618",
  /** --------------------------------- Cyan -------------------------------- */
  cyan1Color: "#E6FFFB",
  cyan2Color: "#B5F5EC",
  cyan3Color: "#87E8DE",
  cyan4Color: "#5CDBD3",
  cyan5Color: "#36CFC9",
  cyan6Color: "#13C2C2",
  cyan7Color: "#08979C",
  cyan8Color: "#006D75",
  cyan9Color: "#00474F",
  cyan10Color: "#002329",
  /** --------------------------------- GeekBlue -------------------------------- */
  geekBlue1Color: "#F0F5FF",
  geekBlue2Color: "#D6E4FF",
  geekBlue4Color: "#85A5FF",
  geekBlue5Color: "#597EF7",
  geekBlue6Color: "#2F54EB",
  geekBlue7Color: "#1D39C4",
  geekBlue8Color: "#10239E",
  geekBlue9Color: "#061178",
  geekBlue10Color: "#030852",
  /** --------------------------------- Lime -------------------------------- */
  lime1Color: "#FCFFE6",
  lime2Color: "#F4FFB8",
  lime3Color: "#EAFF8F",
  lime4Color: "#D3F261",
  lime6Color: "#A0D911",
  lime7Color: "#7CB305",
  lime8Color: "#5B8C00",
  lime9Color: "#3F6600",
  lime10Color: "#254000",
  /** --------------------------------- Purple -------------------------------- */
  purple1Color: "#F9F0FF",
  purple2Color: "#EFDBFF",
  purple3Color: "#D3ADF7",
  purple4Color: "#B37FEB",
  purple5Color: "#9254DE",
  purple6Color: "#722ED1",
  purple7Color: "#531DAB",
  purple8Color: "#391085",
  purple9Color: "#22075E",
  purple10Color: "#120338",
  /** --------------------------------- Magenta -------------------------------- */
  magenta1Color: "#FFF0F6",
  magenta2Color: "#FFD6E7",
  magenta3Color: "#FFADD2",
  magenta4Color: "#FF85C0",
  magenta5Color: "#F759AB",
  magenta6Color: "#EB2F96",
  magenta7Color: "#C41D7F",
  magenta8Color: "#9E1068",
  magenta9Color: "#780650",
  magenta10Color: "#520339",
  /** --------------------------------- Graphite -------------------------------- */
  graphite1Color: "#2C2C2C",
  graphite2Color: "#232323",
  /** --------------------------------- Thrust -------------------------------- */
  thrust0Color: "#E1FAF6",
  thrust1Color: "#92DBD6",
  thrust2Color: "#50CCC4",
  thrust3Color: "#00E2D5",
  thrust4Color: "#0CB3B3",
  thrust5Color: "#089494",
  /** =========================== Colors [END]  =========================== */
};

export const theme = {
  // ----- padding && margin [START] -----//
  defaultSpace: 24,
  smallSpace: 12,
  topPanelHeight: 64,
  // ----- padding && margin [END] -----//

  // ----- tableStyles [START] -----//
  tableCheckboxColumnWidth: 38,
  tableContextMenuColumnWidth: 38,
  tableRowBorderSize: 1,
  tableRowLineHeight: 22,
  tableCellHorizontalPadding: 8,
  tableCellVerticalPadding: 8,
  tableSorterSize: 11,
  // ----- tableStyles [END] -----//

  // ----- editableTableStyles [START] -----//
  editableTableRowHeight: 42,
  editableTableFieldHeight: 28,
  editableTableFieldHorizontalPadding: 8,
  editableTableFieldVerticalPadding: 3,
  editableTableMarginLeft: 0,
  editableTableMarginRight: 8,
  // ----- editableTableStyles [END] -----//

  // ----- commonTableStyles [START] -----//
  /**
   * Минимальная высота строки для стандартных таблиц.
   * Общая высота строки формируется из вертикальных padding-отступов,
   * высоты контента и ширины границы, поэтому, при изменении высоты строки,
   * стоит учитывать все эти параметры.
   */
  commonTableRowHeight: 38,
  // ----- commonTableStyles [END] -----//

  // ----- drawerStyles [START] -----//
  drawerZIndex: 1050,
  drawerSmallWidth: 420,
  drawerMediumWidth: 580,
  drawerLargeWidth: 720,
  drawerXLargeWidth: 960,
  // ----- drawerStyles [END]-----//

  // ----- modalStyles [START] -----//
  modalLargeWidth: 720,
  // ----- modalStyles [END]-----//

  // ----- fontSize [START] -----//
  h0FontSize: 40,
  h1FontSize: 24,
  h2FontSize: 22,
  h3FontSize: 18,
  subtitleFontSize: 16,
  h4FontSize: 14,
  h5FontSize: 12,
  h6FontSize: 10,
  // ----- fontSize [END] -----//

  // ----- lineHeight [START] -----//
  verySmallLineHeight: 20,
  defaultLineHeight: 22,
  smallLineHeight: 24,
  mediumLineHeight: 32,
  largeLineHeight: 40,
  // ----- lineHeight [END] -----//

  /** =========================== Colors Tags [START]  =========================== */
  tagsStyles: {
    blue: {
      backgroundColor: "#F0F8FF",
      borderColor: "#E6F1FA",
      textColor: "#2667D1",
      closeIconColor: "#8C8C8C",
    },
    geekblue: {
      backgroundColor: "#F0F5FF",
      borderColor: "#E6EDFA",
      textColor: "#1D39C4",
      closeIconColor: "#8C8C8C",
    },
    red: {
      backgroundColor: "#FFF3F0",
      borderColor: "#FAEAE6",
      textColor: "#D93A36",
      closeIconColor: "#8C8C8C",
    },
    volcano: {
      backgroundColor: "#FFF2E8",
      borderColor: "#FAE9DC",
      textColor: "#FA541C",
      closeIconColor: "#8C8C8C",
    },
    orange: {
      backgroundColor: "#FFF7E6",
      borderColor: "#FAF0D9",
      textColor: "#FA8C16",
      closeIconColor: "#8C8C8C",
    },
    yellow: {
      backgroundColor: "#FEFFE6",
      borderColor: "#F9FAD2",
      textColor: "#D4B106",
      closeIconColor: "#8C8C8C",
    },
    lime: {
      backgroundColor: "#FCFFE6",
      borderColor: "#F1F5D3",
      textColor: "#7CB305",
      closeIconColor: "#8C8C8C",
    },
    green: {
      backgroundColor: "#E8F5E9",
      borderColor: "#DDF0DE",
      textColor: "#4CAF50",
      closeIconColor: "#8C8C8C",
    },
    cyan: {
      backgroundColor: "#E6FFFB",
      borderColor: "#D7FAF4",
      textColor: "#13C2C2",
      closeIconColor: "#8C8C8C",
    },
    pink: {
      backgroundColor: "#FFF0F6",
      borderColor: "#FAE6EE",
      textColor: "#F759AB",
      closeIconColor: "#8C8C8C",
    },
    purple: {
      backgroundColor: "#F9F0FF",
      borderColor: "#F2E6FA",
      textColor: "#531DAB",
      closeIconColor: "#8C8C8C",
    },
    grey: {
      backgroundColor: "#F5F5F5",
      borderColor: "#F0F0F0",
      textColor: "#595959",
      closeIconColor: "#8C8C8C",
    },
    darkGrey: {
      backgroundColor: "#F0F0F0",
      borderColor: "#E6E6E6",
      textColor: "#595959",
      closeIconColor: "#FFFFFF",
    },
    blueInv: {
      backgroundColor: "#2667D1",
      borderColor: "none",
      textColor: "#FFFFFF",
      closeIconColor: "#FFFFFF",
    },
    geekblueInv: {
      backgroundColor: "#1D39C4",
      borderColor: "none",
      textColor: "#FFFFFF",
      closeIconColor: "#FFFFFF",
    },
    redInv: {
      backgroundColor: "#D93A36",
      borderColor: "none",
      textColor: "#FFFFFF",
      closeIconColor: "#FFFFFF",
    },
    volcanoInv: {
      backgroundColor: "#FA541C",
      borderColor: "none",
      textColor: "#FFFFFF",
      closeIconColor: "#FFFFFF",
    },
    orangeInv: {
      backgroundColor: "#FA8C16",
      borderColor: "none",
      textColor: "#FFFFFF",
      closeIconColor: "#FFFFFF",
    },
    yellowInv: {
      backgroundColor: "#F6C33E",
      borderColor: "none",
      textColor: "#FFFFFF",
      closeIconColor: "#FFFFFF",
    },
    limeInv: {
      backgroundColor: "#A0D911",
      borderColor: "none",
      textColor: "#FFFFFF",
      closeIconColor: "#FFFFFF",
    },
    greenInv: {
      backgroundColor: "#4CAF50",
      borderColor: "none",
      textColor: "#FFFFFF",
      closeIconColor: "#FFFFFF",
    },
    cyanInv: {
      backgroundColor: "#13C2C2",
      borderColor: "none",
      textColor: "#FFFFFF",
      closeIconColor: "#FFFFFF",
    },
    pinkInv: {
      backgroundColor: "#F759AB",
      borderColor: "none",
      textColor: "#FFFFFF",
      closeIconColor: "#FFFFFF",
    },
    purpleInv: {
      backgroundColor: "#722ED1",
      borderColor: "none",
      textColor: "#FFFFFF",
      closeIconColor: "#FFFFFF",
    },
    greyInv: {
      backgroundColor: "#8C8C8C",
      borderColor: "none",
      textColor: "#FFFFFF",
      closeIconColor: "#FFFFFF",
    },
  },
  /** Header Menu */
  headerPanel: {
    backgroundColor: colors.graphite1Color,
    backgroundColorHover: colors.grey13Color,
    textColor: colors.grey3Color,
    textColorHover: colors.grey1Color,
    iconsBackgroundColor: colors.graphite1Color,
    iconsBackgroundColorHover: colors.grey13Color,
    iconsColor: colors.grey3Color,
    iconsColorHover: colors.grey1Color,
    dropdownBackgroundColor: colors.grey13Color,
    dropdownTextColor: colors.grey3Color,
    dropdownItemColorHover: colors.graphite1Color,
  },

  /** =========================== Colors Tags [END]  =========================== */

  /** =========================== Link Colors [START]  =========================== */

  linkHoverColor: "#498af2",

  /** =========================== Link Colors [END]  =========================== */

  /** =========================== Brand Colors [START]  =========================== */

  brandDefaultColor: "#1E3799",
  brandDarkColor: "#05218C",

  /** =========================== Brand Colors [END]  =========================== */

  /** =========================== Colors [END]  =========================== */

  // ----- height [START] -----//
  // Высота меню сверху
  heightHeader: 56,
  heightHeaderMenu: 48,
  heightDividerHeaderMenu: 36,
  // ----- height [END] -----//
  ...colors,
} as const;

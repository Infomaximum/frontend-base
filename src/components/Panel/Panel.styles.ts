import { CollapsibleContentAnimationInterval } from "../../utils/const";

const headerPanelCollapseStyle = {
  padding: "10px 12px !important",
  fontSize: "12px",
  lineHeight: "16px !important",
};

export const panelCollapseStyle = (theme: TTheme) => ({
  borderBottom: `1px solid ${theme.grey4Color} !important`,
  ".ant-collapse-header": {
    color: `${theme.grey9Color} !important`,
    borderRadius: "0px !important",
    letterSpacing: "0.1em",
    fontWeight: 400,
    ":hover": {
      color: `${theme.blue6Color} !important`,
    },
    ...headerPanelCollapseStyle,
  },
  ".ant-collapse-content": {
    transition: `height ${CollapsibleContentAnimationInterval}ms linear, opacity ${CollapsibleContentAnimationInterval}ms linear !important`,
  },
  ".ant-collapse-content-box": {
    padding: "0px 12px 24px !important",
  },
  "&.ant-collapse-item-active > .ant-collapse-header": {
    ...headerPanelCollapseStyle,
    fontWeight: 500,
    color: `${theme.grey10Color} !important`,
    ":hover": {
      color: `${theme.blue6Color} !important`,
      boxShadow: "none",
    },
  },
  "&:last-of-type": {
    borderBottom: "0 !important",
  },
  "&.ant-collapse-item:last-of-type > .ant-collapse-header": {
    ":hover": {
      boxShadow: `none !important`,
    },
  },
});

import { css, keyframes } from "@emotion/react";
import AuthorizationBackground from "../../resources/icons/AuthorizationBackground.svg?url";

export const layoutStyle = (theme: TTheme) => [
  css`
    height: 100vh;
    height: 100dvh;
  `,
  {
    overflowY: "auto",
    backgroundColor: theme.brandDefaultColor,
    backgroundImage: `url(${AuthorizationBackground})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
  } as const,
];

export const unAuthorizedContentStyle = () =>
  ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "24px",
    paddingBottom: "24px",
    minHeight: "min-content", // fix для корректной работы скролла
  }) as const;

export const iconBackStyle = (theme: TTheme) => ({
  color: theme.grey10Color,
  paddingRight: "7px",
});

export const backLinkStyle = {
  display: "inline-block",
  marginRight: "12px",
};

const shakeAndDanceKeyframeStyle = {
  "0%": { transform: "translateX(0px)" },
  "10%": { transform: "translateX(-5px)" },
  "20%": { transform: "translateX(10px)" },
  "30%": { transform: "translateX(-20px)" },
  "40%": { transform: "translateX(20px)" },
  "50%": { transform: "translateX(-15px)" },
  "60%": { transform: "translateX(10px)" },
  "70%": { transform: "translateX(-7px)" },
  "80%": { transform: "translateX(4px)" },
  "90%": { transform: "translateX(-2px)" },
  "100%": { transform: "translateX(0px)" },
};

export const wrapperContentLoginStyle = {
  width: "472px",
};

export const animationContentLoginStyle = {
  animation: `${keyframes(shakeAndDanceKeyframeStyle)} 1s ease-out`,
};

export const formBodyCutStyle = {
  padding: "32px 48px 48px",
};

export const headStyle = {
  padding: "16px 48px",
};

export const formBodyDefaultStyle = {
  padding: "56px 48px 48px",
};

export const companyNameStyle = (theme: TTheme) => ({
  color: theme.grey1Color,
  marginBottom: "22px",
});

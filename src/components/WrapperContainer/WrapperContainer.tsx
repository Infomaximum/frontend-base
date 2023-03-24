import React from "react";
import { Layout } from "antd";
import type { IWrapperContainerProps } from "./WrapperContainer.types";
import { useLocalization } from "../../decorators/hooks/useLocalization";
import { assertSimple } from "@infomaximum/assert";
import { commonContentStyle, commonLayoutStyle } from "../../styles/common.styles";
import { HeaderMenuPortal } from "../HeaderMenu/HeaderMenuPortal/HeaderMenuPortal";
import { MAIN_LAYOUT_CONTENT_ID } from "../../utils/const";

const WrapperContainerComponent: React.FC<IWrapperContainerProps> = ({
  route,
  component: Component,
  ...rest
}) => {
  const localization = useLocalization();

  assertSimple(!!route.loc, "Не передана локализация");

  return (
    <Layout css={commonLayoutStyle}>
      <HeaderMenuPortal key="header-menu">
        <HeaderMenuPortal.Title key="header-menu-title">
          {localization.getLocalized(route.loc)}
        </HeaderMenuPortal.Title>
      </HeaderMenuPortal>
      <Layout.Content css={commonContentStyle} id={MAIN_LAYOUT_CONTENT_ID}>
        <Component route={route} {...rest} />
      </Layout.Content>
    </Layout>
  );
};

const WrapperContainer = React.memo(WrapperContainerComponent);

export { WrapperContainer };

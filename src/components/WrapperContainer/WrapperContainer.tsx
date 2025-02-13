import React from "react";
import { Layout } from "antd";
import type { IWrapperContainerProps } from "./WrapperContainer.types";
import { useLocalization } from "../../decorators/hooks/useLocalization";
import { assertSimple } from "@infomaximum/assert";
import { commonLayoutStyle } from "../../styles/common.styles";
import { MAIN_LAYOUT_CONTENT_ID, MAIN_LAYOUT_SCROLL_CONTAINER_ID } from "../../utils/const";
import { contentStyle, scrollContainerStyle, titleStyle } from "./WrapperContainer.styles";

const WrapperContainerComponent: React.FC<IWrapperContainerProps> = ({
  route,
  component: Component,
  ...rest
}) => {
  const localization = useLocalization();

  assertSimple(!!route.loc, "Не передана локализация");

  return (
    <Layout css={commonLayoutStyle}>
      <Layout.Content css={contentStyle} id={MAIN_LAYOUT_CONTENT_ID}>
        <div css={titleStyle}>{localization.getLocalized(route.loc)}</div>

        <Layout.Content css={scrollContainerStyle} id={MAIN_LAYOUT_SCROLL_CONTAINER_ID}>
          <Component route={route} {...rest} />
        </Layout.Content>
      </Layout.Content>
    </Layout>
  );
};

const WrapperContainer = React.memo(WrapperContainerComponent);

export { WrapperContainer };

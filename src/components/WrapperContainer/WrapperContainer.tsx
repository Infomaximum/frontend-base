import React from "react";
import { Layout } from "antd";
import type { IWrapperContainerProps } from "./WrapperContainer.types";
import { useLocalization } from "@infomaximum/base/src/decorators/hooks/useLocalization";
import { assertSimple } from "@infomaximum/assert";
import { commonLayoutStyle } from "@infomaximum/base/src/styles/common.styles";
import { SystemLoaderProvider } from "@infomaximum/base/src/managers/SystemLoaderProvider";
import {
  MAIN_LAYOUT_CONTENT_ID,
  MAIN_LAYOUT_SCROLL_CONTAINER_ID,
} from "@infomaximum/base/src/utils/const";
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

        <SystemLoaderProvider>
          <Layout.Content css={scrollContainerStyle} id={MAIN_LAYOUT_SCROLL_CONTAINER_ID}>
            <Component route={route} {...rest} />
          </Layout.Content>
        </SystemLoaderProvider>
      </Layout.Content>
    </Layout>
  );
};

const WrapperContainer = React.memo(WrapperContainerComponent);

export { WrapperContainer };

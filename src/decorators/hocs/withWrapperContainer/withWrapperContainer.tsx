import React from "react";
import type { NCore } from "@infomaximum/base/src/libs/core";
import type { IWrapperContainerProps } from "@infomaximum/base/src/components/WrapperContainer/WrapperContainer.types";
import { WrapperContainer } from "@infomaximum/base/src/components/WrapperContainer/WrapperContainer";

type TCommonContainerProps = Omit<
  IWrapperContainerProps,
  "component" | keyof NCore.TRouteComponentProps
>;

const withWrapperContainer =
  <T extends React.ComponentType<NCore.TRouteComponentProps>>(
    component: T,
    commonContainerProps?: TCommonContainerProps
  ) =>
  (props: NCore.TRouteComponentProps) => (
    <WrapperContainer {...props} {...(commonContainerProps ?? {})} component={component} />
  );

export { withWrapperContainer };

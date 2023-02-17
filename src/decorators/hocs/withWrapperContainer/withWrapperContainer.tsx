import React from "react";
import type { NCore } from "@im/core";
import type { IWrapperContainerProps } from "../../../components/WrapperContainer/WrapperContainer.types";
import { WrapperContainer } from "../../../components/WrapperContainer/WrapperContainer";

type TCommonContainerProps = Omit<
  IWrapperContainerProps,
  "component" | keyof NCore.TRouteComponentProps
>;

const withWrapperContainer =
  <T extends React.ComponentType<NCore.TRouteComponentProps>>(
    component: T,
    commonContainerProps?: TCommonContainerProps
  ) =>
  (props: NCore.TRouteComponentProps) =>
    <WrapperContainer {...props} {...(commonContainerProps ?? {})} component={component} />;

export { withWrapperContainer };

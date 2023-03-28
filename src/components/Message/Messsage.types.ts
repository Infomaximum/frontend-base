import type { NCore } from "@infomaximum/module-expander";
import type { Localization, TLocalizationDescription } from "@infomaximum/localization";
import type { ConfigOptions } from "antd/lib/message";
import type { ReactNode } from "react";

export type TGetMassAssignMessageParams = {
  localization: Localization;
  entityLoc: TLocalizationDescription;
  entities: ReactNode;
  targetObjectList: {
    count: number;
    loc: TLocalizationDescription;
  }[];
};

export interface IMessageProps {
  config?: ConfigOptions;
  notification: ReactNode | (() => ReactNode) | [() => ReactNode];
  messageDuration?: number;
  type?: string;
  localization?: Localization;
}

export type TRemoveMessageProps = {
  localization: Localization;
  entityLoc?: TLocalizationDescription;
  name?: string;
  messageLoc?: TLocalizationDescription;
  feminineGenus?: boolean;
  messageLocStartEnd?: {
    messageStart?: TLocalizationDescription;
    messageEnd?: TLocalizationDescription;
  };
  messageLocTemplateDataBold?: string;
};

export interface IMessageMethodProps {
  initialValues: TDictionary;
  localization: Localization;
  blockUri: string;
  messageOptions?: {
    nameFieldKeyList: string[];
    entityLoc: TLocalizationDescription;
    navigate: NCore.TRouteComponentProps["navigate"];
    feminineGenus?: boolean;
  };
}

export interface IMessageBodyProps {
  messageBody: ReactNode;
  messageKey: string | number;
  duration: number;
}

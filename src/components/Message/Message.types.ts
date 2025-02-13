import type { NCore } from "@infomaximum/module-expander";
import type { Localization, TLocalizationDescription } from "@infomaximum/localization";
import type { ReactNode } from "react";
import type { ConfigOptions } from "antd/lib/message/interface";

export type TGenus = "male" | "female" | "neuter";

export type TGetMassAssignMessageParams = {
  localization: Localization;
  entityLoc: TLocalizationDescription;
  entityValue: ReactNode;
  genus?: TGenus;
};

export interface IMessageProps {
  config?: ConfigOptions;
  notification: ReactNode | (() => ReactNode) | [() => ReactNode];
  messageDuration?: number;
  type?: string;
  localization?: Localization;
  noticeStyle?: React.CSSProperties;
  closable?: boolean;
  infinity?: boolean;
  customKey?: string;
}

export type TRemoveMessageProps = {
  localization: Localization;
  entityLoc?: TLocalizationDescription;
  name?: string;
  messageLoc?: TLocalizationDescription;
  feminineGenus?: boolean;
  neuterGenus?: boolean;
  messageLocStartEnd?: {
    messageStart?: TLocalizationDescription;
    messageEnd?: TLocalizationDescription;
  };
  messageLocTemplateDataBold?: string;
  isPlural?: boolean;
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
  closable?: boolean;
  infinity?: boolean;
}

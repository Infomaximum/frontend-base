import type { Localization, TLocalizationDescription } from "@infomaximum/localization";
import type { ReactNode } from "react";
import type {
  ConfigType,
  MessageType,
  SpecialMessageTaskType,
} from "@infomaximum/ui-kit/dist/components/Message/message.types";
import type { NCore } from "@infomaximum/base/src/libs/core";

export enum EMassAssignEndings {
  MALE = "male",
  FEMALE = "female",
  NEUTER = "neuter",
  PLURAL = "plural",
}

export type TGetMassAssignMessageParams = {
  localization: Localization;
  entityLoc: TLocalizationDescription;
  entityValue?: ReactNode;
  ending?: EMassAssignEndings;
};

type TPickSpecialMessageTaskType = "onClick" | "onClose" | "styles" | "className" | "closable";

export interface IMessageProps extends Pick<SpecialMessageTaskType, TPickSpecialMessageTaskType> {
  config?: ConfigType;
  notification: ReactNode | (() => ReactNode) | [() => ReactNode];
  messageDuration?: number;
  type?: MessageType;
  customKey?: SpecialMessageTaskType["key"];
}

export type TRemoveMessageProps = {
  localization: Localization;
  entityLoc?: TLocalizationDescription;
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

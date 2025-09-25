import React, { type ReactNode } from "react";
import { message } from "@infomaximum/ui-kit";
import { uniqueId } from "lodash";
import {
  type TRemoveMessageProps,
  type TGetMassAssignMessageParams,
  EMassAssignEndings,
  type IMessageProps,
} from "./Message.types";
import { isString, isFunction, isUndefined } from "lodash";
import {
  DELETED_MASCULINE,
  DELETED_FEMININE,
  OBJECTS_DELETED,
  SAVED,
  CREATED_FEMININE,
  CREATED_MASCULINE,
  MOVED_TO,
  DELETED_NEUTER,
  DELETED_PLURAL,
} from "@infomaximum/base/src/utils/Localization/Localization";
import {
  customMessageTestId,
  createMessageTestId,
  removeMessageTestId,
  moveMessageTestId,
  massAssignMessageTestId,
} from "@infomaximum/base/src/utils/TestIds";
import { Localization, type TLocalizationDescription } from "@infomaximum/localization";
import { getAppliedLocalized } from "./Message.utils";
import type { NCore } from "@infomaximum/base/src/libs/core";
import type { MessageKey } from "@infomaximum/ui-kit/dist/components/Message/message.types";

function showMessageGrid(props: IMessageProps, notification: ReactNode) {
  const {
    config,
    closable = true,
    messageDuration,
    styles,
    type,
    customKey,
    onClick,
    onClose,
    className,
    infinity = false,
  } = props;
  const duration = infinity ? 0 : messageDuration;
  const key = customKey ?? uniqueId("message-key");

  const notificationData = {
    placement: config?.placement,
    content: notification,
    duration,
    closable,
    rtl: config?.rtl,
    styles,
    key,
    onClose,
    onClick,
    className,
  };

  switch (type) {
    case "success":
      return message.success(notificationData);
    case "error":
      return message.error(notificationData);
    case "info":
      return message.info(notificationData);
    case "warning":
      return message.warning(notificationData);
    case "loading":
      return message.loading(notificationData);
    default:
      return message.success(notificationData);
  }
}

class MessageComponent {
  /**
   * Возвращающая ссылку на созданный профиль
   * @param navigate
   * @param path - путь к профилю
   * @param linkCaption - текст ссылки
   */
  private static getProfileLink(
    navigate: NCore.TRouteComponentProps["navigate"],
    path: string,
    linkCaption: string
  ): ReactNode {
    return (
      <a
        onClick={(e) => {
          e.preventDefault();
          navigate(path, {
            state: {
              displayName: linkCaption,
            },
          });
          message.destroy("message-link");
        }}
        key="message-link"
      >
        {linkCaption}
      </a>
    );
  }

  /**
   * Возвращает кастомное сообщение
   * @param getNotification - функция, возвращающая массив готовых элементов сообщения
   */
  public static getCustomMessage(notification: string | ReactNode) {
    return !isUndefined(notification) ? (
      <div key="custom-message-content" test-id={customMessageTestId}>
        {notification}
      </div>
    ) : null;
  }

  /**
   * Метод генерации сообщения о создании
   * @param localization
   * @param entityLoc - locDescr сущности
   * @param navigate
   * @param path - путь к профилю
   * @param linkCaption - текст ссылки
   * @param feminineGenus - женский род для "Создана"
   */
  public static getCreateMessage(
    localization: Localization,
    entityLoc: TLocalizationDescription,
    navigate: NCore.TRouteComponentProps["navigate"],
    path: string,
    linkCaption: string,
    feminineGenus?: boolean
  ): ReactNode {
    if (localization && entityLoc && path && linkCaption) {
      const prefix = localization.getLocalized(
        feminineGenus ? CREATED_FEMININE : CREATED_MASCULINE
      );
      const postfix =
        localization.getLocalized(CREATED_MASCULINE).charAt(0).toLowerCase() +
        localization.getLocalized(CREATED_MASCULINE).substr(1);
      const entity = localization.getLocalized(entityLoc);
      const entityFirstSymbolLower = isString(entity)
        ? entity.charAt(0).toLowerCase() + entity.substr(1)
        : entity;

      return localization.getLanguage() === Localization.Language.ru ? (
        <div key="standard-message-content" test-id={createMessageTestId}>
          {`${prefix} ${entityFirstSymbolLower} `}
          <b>{this.getProfileLink(navigate, path, linkCaption)}</b>
        </div>
      ) : (
        <div key="standard-message-content" test-id={createMessageTestId}>
          {`${entity} `} <b>{this.getProfileLink(navigate, path, linkCaption)}</b> {` ${postfix}`}
        </div>
      );
    }
  }

  /**
   * Метод возвращает сообщение об удалении (для сообщения "объекты удалены" нужна только локализация)
   * props:
   * @param localization: LocalizationType - локализация
   * @param entityLoc?: TLocalizationDescription - Имя сущности
   * @param name?: string - название
   * @param feminineGenus?: boolean - женский род если для "удалена"
   */
  public static getRemoveMessage(props: TRemoveMessageProps) {
    const {
      localization,
      entityLoc,
      messageLoc,
      feminineGenus,
      neuterGenus,
      isPlural,
      messageLocStartEnd,
      messageLocTemplateDataBold,
    } = props;

    if (entityLoc) {
      return (
        <div key="remove-message" test-id={removeMessageTestId}>
          {`${localization.getLocalized(entityLoc)}`}
          {` ${localization.getLocalized(
            feminineGenus
              ? DELETED_FEMININE
              : neuterGenus
                ? DELETED_NEUTER
                : isPlural
                  ? DELETED_PLURAL
                  : DELETED_MASCULINE
          )}`}
        </div>
      );
    }

    if (messageLoc && !messageLocTemplateDataBold) {
      return (
        <div key="remove-message-content" test-id={removeMessageTestId}>
          {localization.getLocalized(messageLoc)}
        </div>
      );
    }

    if (
      messageLocTemplateDataBold &&
      !messageLoc &&
      messageLocStartEnd?.messageStart &&
      messageLocStartEnd?.messageEnd
    ) {
      return (
        <div key="remove-message" test-id={removeMessageTestId}>
          {`${localization.getLocalized(messageLocStartEnd.messageStart)}`}
          {` ${messageLocTemplateDataBold} `}
          {`${localization.getLocalized(messageLocStartEnd.messageEnd)}`}
        </div>
      );
    }

    return (
      <div key="remove-message-content" test-id={removeMessageTestId}>
        {localization.getLocalized(OBJECTS_DELETED)}
      </div>
    );
  }

  /**
   * Метод, возвращающий сообщение для перемещения
   * @param localization - локализация
   * @param entityLoc -LocDescr для сущности того, что перемещаем
   * @param navigate
   * @param entityInstancePath - путь к перемещенному объекту
   * @param entityInstanceLinkCaption - caption для ссылки
   * @param entityPlaceLoc - LocDescr для сущности, куда перемещаем
   * @param entityInstancePlace - название места, куда переместили
   */
  public static getMoveMessage(
    localization: Localization,
    entityLoc: TLocalizationDescription,
    navigate: NCore.TRouteComponentProps["navigate"] | undefined,
    entityInstancePath: string,
    entityInstanceLinkCaption: string | undefined,
    entityPlaceLoc: TLocalizationDescription,
    entityInstancePlace: string | undefined
  ) {
    if (
      localization &&
      entityLoc &&
      navigate &&
      entityInstancePath &&
      entityInstanceLinkCaption &&
      entityPlaceLoc &&
      entityInstancePlace
    ) {
      const entityPlace = localization.getLocalized(entityPlaceLoc);
      const entityPlaceFirstSymbolLower = isString(entityPlace)
        ? entityPlace.charAt(0).toLowerCase() + entityPlace.substr(1)
        : entityPlace;

      return (
        <div key="move-message-content" test-id={moveMessageTestId}>
          {`${localization.getLocalized(entityLoc)} `}
          <b>{this.getProfileLink(navigate, entityInstancePath, entityInstanceLinkCaption)}</b>
          {` ${localization.getLocalized(MOVED_TO)} `}
          {entityPlaceFirstSymbolLower} <b>{entityInstancePlace}</b>
        </div>
      );
    }
  }

  /**
   * Метод, возвращающий сообщение для массового назначения
   * @param params.localization - локализация
   * @param params.entityLoc - локализация сущности массового действия
   * @param params.entityValue - значения массового действия
   * @param params.ending - род или множественное число для APPLIED (по умолчанию "male")
   */
  public static getMassAssignMessage(params: TGetMassAssignMessageParams) {
    const { localization, entityLoc, entityValue, ending = EMassAssignEndings.MALE } = params;

    const localizedApplied = getAppliedLocalized(localization, ending);

    return (
      <div key="mass-assign-message-content" test-id={massAssignMessageTestId}>
        {localization.getLocalized(entityLoc)}
        {entityValue ? <> – {entityValue} </> : " "}
        {localizedApplied}
      </div>
    );
  }

  public static getDefaultSaveMessage(localization: Localization) {
    return localization?.getLocalized(SAVED);
  }

  public static showMessage(props: IMessageProps) {
    const notifications = isFunction(props.notification)
      ? props.notification()
      : props.notification;

    if (Array.isArray(notifications)) {
      notifications.map((notification: any) => {
        showMessageGrid(props, notification);
      });
    } else {
      showMessageGrid(props, notifications);
    }
  }

  public static hideMessage(key: MessageKey) {
    message.destroy(key);
  }
}

export const Message = MessageComponent;

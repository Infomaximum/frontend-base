import React, { ReactNode } from "react";
import { message } from "antd";
import {
  isString,
  isFunction,
  forEach,
  isEqual,
  map,
  difference,
  filter,
  isUndefined,
  uniqueId,
} from "lodash";
import { generatePath } from "react-router";
import {
  entityStyle,
  messageNoticeStyle,
  messageStyle,
  nameStyles,
} from "./Message.styles";
import {
  CHANGES_SAVED,
  RENAMED_MASCULINE,
  RENAMED_FEMININE,
  DELETED_MASCULINE,
  DELETED_FEMININE,
  OBJECTS_DELETED,
  SAVED,
  MASS_ACTION,
  APPLIED_TO,
  CREATED_FEMININE,
  CREATED_MASCULINE,
  MOVED_TO,
} from "../../utils/Localization/Localization";
import type {
  IMessageMethodProps,
  IMessageProps,
  TRemoveMessageProps,
  TGetMassAssignMessageParams,
} from "./Messsage.types";
import {
  customMessageTestId,
  standardMessageTestId,
  createMessageTestId,
  renameMessageTestId,
  changeMessageTestId,
  removeMessageTestId,
  moveMessageTestId,
  massAssignMessageTestId,
} from "../../utils/TestIds";
import MessageBody from "./MessageBody";
import { ThemeContext } from "@emotion/react";
import type { NCore } from "@im/core";
import { theme } from "../../styles/theme";
import { Localization, TLocalizationDescription } from "@im/localization";

const duration = 4000;

function showMessageGrid(props: IMessageProps, notification: ReactNode) {
  const messageDuration = props.messageDuration
    ? props.messageDuration * 1000
    : duration;

  const messageKey = uniqueId("message-key");

  const notificationData = {
    content: (
      <ThemeContext.Provider value={theme}>
        <MessageBody
          duration={messageDuration}
          messageKey={messageKey}
          messageBody={notification}
        />
      </ThemeContext.Provider>
    ),
    key: messageKey,
    style: messageNoticeStyle,
  };

  switch (props.type) {
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
  ): React.ReactNode {
    return (
      <a
        // eslint-disable-next-line react/jsx-no-bind
        onClick={(e) => {
          e.preventDefault();
          navigate(path, {
            state: {
              displayName: linkCaption,
            },
          });
          message.destroy();
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
  public static getCustomMessage(notification: string | React.ReactNode) {
    return !isUndefined(notification) ? (
      <div
        css={messageStyle}
        key="custom-message-content"
        test-id={customMessageTestId}
      >
        {notification}
      </div>
    ) : null;
  }

  /**
   * Метод возвращает либо обычное сообщение либо сообщение формата: текст ссылка
   * @param localizedPrefix - Часть сообщения до ссылки
   * @param navigate
   * @param path - Готовый путь для ссылки
   * @param linkCaption - текст ссылки
   */
  public static getStandardMessage(
    localizedPrefix: string | React.ReactNode,
    navigate?: NCore.TRouteComponentProps["navigate"],
    path?: string,
    linkCaption?: string
  ): React.ReactNode {
    let message: React.ReactNode = localizedPrefix;

    if (navigate && path && linkCaption) {
      message = (
        <>
          {message}: {this.getProfileLink(navigate, path, linkCaption)}
        </>
      );
    }

    return (
      <div
        css={messageStyle}
        key="standard-message-content"
        test-id={standardMessageTestId}
      >
        {message}
      </div>
    );
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
  ): React.ReactNode {
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
        <div
          css={messageStyle}
          key="standard-message-content"
          test-id={createMessageTestId}
        >
          {`${prefix} ${entityFirstSymbolLower} `}
          <b>{this.getProfileLink(navigate, path, linkCaption)}</b>
        </div>
      ) : (
        <div
          css={messageStyle}
          key="standard-message-content"
          test-id={createMessageTestId}
        >
          {`${entity} `}{" "}
          <b>{this.getProfileLink(navigate, path, linkCaption)}</b>{" "}
          {` ${postfix}`}
        </div>
      );
    }
  }

  /**
   * метод по начальным и текущим значениям полей формы возвращает массив ключей/названий полей,
   * которые были изменены
   */
  private static getKeysOfChangedFormFieldList(
    formValues: TDictionary,
    initialValues: TDictionary
  ) {
    // названия полей формы
    const formFieldsKeys = Object.keys(formValues);
    // ключи измененных полей
    const changes: string[] = [];

    forEach(formFieldsKeys, (key: string) => {
      if (
        formValues.hasOwnProperty(key) &&
        initialValues.hasOwnProperty(key) &&
        !isEqual(formValues[key], initialValues[key])
      ) {
        changes.push(key);
      }
    });
    return changes;
  }

  public static getRenameMessage(
    formValues: TDictionary,
    props: IMessageMethodProps
  ) {
    const { initialValues, localization, blockUri } = props;
    const changes: string[] = this.getKeysOfChangedFormFieldList(
      formValues,
      initialValues
    );
    if (props.messageOptions) {
      const { nameFieldKeyList, entityLoc, navigate } = props.messageOptions;
      const feminineGenus = props.messageOptions?.feminineGenus;

      const locRenamed = localization.getLocalized(
        feminineGenus ? RENAMED_FEMININE : RENAMED_MASCULINE
      );

      // имя до изменений по InitialValues формы
      const nameByInitialValues: string = this.getName(
        nameFieldKeyList,
        initialValues
      );

      if (
        difference(nameFieldKeyList, changes).length !== nameFieldKeyList.length
      ) {
        // имя после изменений по значениям формы
        const nameByFormValues: string = this.getName(
          nameFieldKeyList,
          formValues
        );

        return (
          <div
            css={messageStyle}
            key="rename-message-content"
            test-id={renameMessageTestId}
          >
            {`${localization.getLocalized(entityLoc)}`}{" "}
            <b>{nameByInitialValues}</b>
            {` ${locRenamed}: `}
            {Message.getProfileLink(
              navigate,
              generatePath(blockUri),
              nameByFormValues
            )}
          </div>
        );
      }
    }
  }

  /**k
   * Метод возвращает имя сущности по значениям полей формы и ключам полей имени
   * @param nameFieldKeyList - массив ключей имени
   * @param values - объект значений полей формы
   */
  private static getName(nameFieldKeyList: string[], values: TDictionary) {
    const nameArray: string[] = map(nameFieldKeyList, (fieldKey) => {
      if (values[fieldKey]) {
        return values[fieldKey];
      }
    });
    // имя после изменений по значениям формы
    return nameArray.join(" ");
  }

  /**
   * Метод возвращающий сообщение об изменениях
   */
  public static getChangeMessage(
    formValues: TDictionary,
    props: IMessageMethodProps
  ) {
    const { initialValues, localization, blockUri } = props;
    const changes: string[] = this.getKeysOfChangedFormFieldList(
      formValues,
      initialValues
    );

    if (props.messageOptions) {
      const { nameFieldKeyList, entityLoc, navigate } = props.messageOptions;

      // имя до изменений по InitialValues формы
      const nameByInitialValues: string = this.getName(
        nameFieldKeyList,
        initialValues
      );

      // имя после изменений по значениям формы
      const nameByFormValues: string = this.getName(
        nameFieldKeyList,
        formValues
      );

      const getChangeMessageByName = (name: string) => (
        <div
          css={messageStyle}
          key="change-message-content"
          test-id={changeMessageTestId}
        >
          {`${localization.getLocalized(entityLoc)} `}
          {Message.getProfileLink(navigate, generatePath(blockUri), name)}
          {`: ${localization.getLocalized(CHANGES_SAVED)}`}
        </div>
      );

      if (
        difference(nameFieldKeyList, changes).length === nameFieldKeyList.length
      ) {
        return getChangeMessageByName(nameByInitialValues);
      } else if (difference(changes, nameFieldKeyList).length !== 0) {
        return getChangeMessageByName(nameByFormValues);
      }
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
      name,
      messageLoc,
      feminineGenus,
      messageLocStartEnd,
      messageLocTemplateDataBold,
    } = props;
    if (entityLoc) {
      return (
        <div
          css={messageStyle}
          key="remove-message"
          test-id={removeMessageTestId}
        >
          {`${localization.getLocalized(entityLoc)} `}
          <b css={nameStyles}>{name}</b>
          {` ${localization.getLocalized(
            feminineGenus ? DELETED_FEMININE : DELETED_MASCULINE
          )}`}
        </div>
      );
    }

    if (messageLoc && !messageLocTemplateDataBold) {
      return (
        <div
          css={messageStyle}
          key="remove-message-content"
          test-id={removeMessageTestId}
        >
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
        <div
          css={messageStyle}
          key="remove-message"
          test-id={removeMessageTestId}
        >
          {`${localization.getLocalized(messageLocStartEnd.messageStart)} `}
          <b css={nameStyles}>{` ${messageLocTemplateDataBold} `}</b>
          {` ${localization.getLocalized(messageLocStartEnd.messageEnd)}`}
        </div>
      );
    }

    return (
      <div
        css={messageStyle}
        key="remove-message-content"
        test-id={removeMessageTestId}
      >
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
        <div
          css={messageStyle}
          key="move-message-content"
          test-id={moveMessageTestId}
        >
          {`${localization.getLocalized(entityLoc)} `}
          <b>
            {this.getProfileLink(
              navigate,
              entityInstancePath,
              entityInstanceLinkCaption
            )}
          </b>
          {` ${localization.getLocalized(MOVED_TO)} `}
          {entityPlaceFirstSymbolLower}{" "}
          <b css={nameStyles}>{entityInstancePlace}</b>
        </div>
      );
    }
  }

  /**
   * Метод, возвращающий сообщение для массового назначения
   * @param params.localization - локализация
   * @param params.entityLoc - локализация сущности массового действия
   * @param params.entities - объекты массового действия
   * @param params.targetObjectList - массив объектов сущности к которым применяется массовое действие
   * @param params.targetObject.count - кол-во объектов сущности к которым применяется массовое действие
   * @param params.targetObject.loc - локализация объектов сущности массового назначения
   */
  public static getMassAssignMessage(params: TGetMassAssignMessageParams) {
    const { localization, entityLoc, entities, targetObjectList } = params;
    const filerTargetObjectList = filter(
      targetObjectList,
      (target) => target.count >= 1
    );
    let targetObjectsLoc: string = "";
    forEach(filerTargetObjectList, (value, index) => {
      const lastIndex = filerTargetObjectList.length - 1;
      const targetEssence = `${value.count} ${localization.getLocalized(
        value.loc,
        {
          count: value.count,
        }
      )}`;

      if (lastIndex > 0 && lastIndex !== index) {
        targetObjectsLoc += `${targetEssence}, `;
      } else {
        targetObjectsLoc += targetEssence;
      }
    });

    const massActionFirstSymbolLower =
      localization.getLocalized(MASS_ACTION).charAt(0).toLowerCase() +
      localization.getLocalized(MASS_ACTION).substr(1);

    return localization.getLanguage() === Localization.Language.ru ? (
      <div
        css={messageStyle}
        key="mass-assign-message-content"
        test-id={massAssignMessageTestId}
      >
        {`${localization.getLocalized(MASS_ACTION)} `}
        <b css={entityStyle}>
          {localization.getLocalized(entityLoc)} – {entities}
        </b>
        {` ${localization.getLocalized(APPLIED_TO)} ${targetObjectsLoc}`}
      </div>
    ) : (
      <div
        css={messageStyle}
        key="mass-assign-message-content"
        test-id={massAssignMessageTestId}
      >
        <b css={entityStyle}>
          {localization.getLocalized(entityLoc)} – {entities}
        </b>
        {` ${massActionFirstSymbolLower}`}
        {` ${localization.getLocalized(APPLIED_TO)} ${targetObjectsLoc}`}
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

    if (props.config) {
      message.config({ ...props.config, duration: 0 });
    } else {
      message.config({ duration: 0 });
    }

    if (Array.isArray(notifications)) {
      notifications.map((notification: any) => {
        showMessageGrid(props, notification);
      });
    } else {
      showMessageGrid(props, notifications);
    }
  }
}

export const Message = MessageComponent;

import { find, get, isString } from "lodash";
import { Model } from "@im/utils";
import type PrivilegeModel from "./PrivilegeModel";
import typenameToModel from "@im/base/src/models/typenameToModel";
import type AccessRolesGroupModel from "./AccessRolesGroupModel";
import type AuthenticationModel from "./AuthenticationModel";
import type { LANGUAGE } from "../utils/const";

export const personModelTypename = "employee";

/**
 * Модель сотрудника
 */
class PersonModel extends Model {
  public static override get typename() {
    return personModelTypename;
  }

  /**
   * Возвращает имя сотрудника
   * @returns {string | undefined} имя
   */
  public getFirstName(): string | undefined {
    return this.getStringField("first_name");
  }

  /**
   * Возвращает фамилию сотрудника
   * @returns {string | undefined} фамилия
   */
  public getSecondName(): string | undefined {
    return this.getStringField("second_name");
  }

  /**
   * Возвращает отчество сотрудника
   * @returns {string | undefined} отчество
   */
  public getPatronymic(): string | undefined {
    return this.getStringField("patronymic");
  }

  /**
   * Возвращает табельный номер
   */
  public getPersonnelNumber(): string | undefined {
    return this.getStringField("personnel_number");
  }

  /**
   * Возвращает электронную почту сотрудника
   * @returns {string | undefined} электронная почта
   */
  public getEmail(): string | undefined {
    return this.getStringField("email");
  }

  public get hasAccessToSystemEvents() {
    return this.hasAccessToField("send_system_events");
  }

  public get isSendSystemEvents() {
    return this.getBoolField("send_system_events");
  }

  /**
   * Возвращает флаг доступа ко всем сотрудникам
   * @returns {boolean} флаг доступа
   */
  public getAllEmployeeAccess(): boolean {
    return this.getBoolField("all_employee_access");
  }

  /**
   * Возвращает группу ролей доступа сотрудника
   * @returns {AccessRolesGroupModel} группа ролей доступа
   */
  public getAccessRoleGroup(): AccessRolesGroupModel | undefined {
    return this.getModelField<AccessRolesGroupModel>("access_roles", typenameToModel);
  }

  /**
   * Возвращает статус, является ли сотрудник Администратором
   * @returns {boolean} наличие роли Администратор
   */
  public isAdmin(): boolean {
    return this.getBoolField("admin");
  }

  /**
   * Возвращает язык системы, заданный для пользователя
   * @returns  заданный язык системы
   */
  public getLanguage(): valueof<typeof LANGUAGE> | undefined {
    return this.getStringField("language") as valueof<typeof LANGUAGE>;
  }

  /**
   * Возвращает массив доступных привилегий сотрудника
   * @returns {Array<PrivilegeModel>} привилегии
   */
  public getPrivileges(): PrivilegeModel[] {
    return this.getListField<PrivilegeModel>("privileges", typenameToModel);
  }

  /**
   * Возвращает список привилегий в виде списка с использованием в качестве ключа имени привилегии
   * @returns {TDictionary<string, PrivilegeModel>} список привилегий
   */
  public getPrivilegesList(): TDictionary<PrivilegeModel> {
    const field = "local.privileges_list";
    const list: TDictionary<PrivilegeModel> = {};

    if (!this.isInCache(field)) {
      const privileges = this.getPrivileges();
      const privilegesLength = privileges.length;

      for (let i = 0; i < privilegesLength; i += 1) {
        const privilegesKey = privileges[i]?.getKey();
        const privilege = privileges[i];

        if (list && privilegesKey && privilege) {
          list[privilegesKey] = privilege;
        }
      }
    }

    return this.cacheValue(list, field);
  }

  /** Возвращает список аутентификаций назначенных сотруднику */
  public get authentications() {
    const fieldName = "authentications.items";

    if (!get(this.struct, fieldName)) {
      return [];
    }

    return this.getListField<AuthenticationModel>(fieldName, typenameToModel);
  }

  /** Проверяет назначена ли сотруднику встроенная аутентификация */
  public get isIntegratedAuthentication() {
    const fieldName = "is_integrated_authentications";

    let isIntegratedAuthentications = false;

    if (!this.isInCache(fieldName)) {
      isIntegratedAuthentications = !!find(
        this.authentications,
        (m) => m.getType()?.isIntegratedType
      );
    }

    return this.cacheValue(isIntegratedAuthentications, fieldName);
  }

  /**
   * Возвращает логин сотрудника
   * @returns {string | undefined} логин
   */
  public getLogin(): string | undefined {
    return this.getStringField("login");
  }

  /** Возвращает "Фамилия Имя Отчество (Логин)" сотрудника  */
  public getDisplayNameWithLogin() {
    const name = this.getDisplayName();
    const login = this.getLogin();
    return `${name}${isString(login) ? ` (${login})` : ""}`;
  }

  /**
   * Возвращает признак скрыт ли сотрудник
   */
  public isHidden() {
    return this.getBoolField("hidden");
  }

  /**
   * Возвращает номера сотрудника
   */
  public getPhoneNumbers(): string[] {
    return this.getEnumField<string>("phone_numbers");
  }

  /** Задан ли пароль сотруднику */
  public get hasPassword() {
    return this.getBoolField("has_password");
  }
}

export default PersonModel;

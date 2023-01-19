import type { EDays } from "@im/utils";
import { Model } from "@im/utils";

const logonTypes = {
  EMAIL: "EMAIL",
  LOGIN: "LOGIN",
};

class SystemCommonModel extends Model {
  public static override get typename() {
    return "app_config_core";
  }

  /**
   * Возвращает формат вывода ФИО
   * @returns {string | undefined} DisplayNameFormat
   */
  public getDisplayNameFormat(): string | undefined {
    return this.getStringField("display_name_format");
  }

  /**
   * Возвращает первый день недели
   * @returns {string | undefined} FirstDayWeek
   */
  public getFirstDayWeek(): EDays | undefined {
    return this.getStringField("first_day_of_week") as unknown as EDays | undefined;
  }

  /**
   * Возвращает язык системы
   * @returns {string | undefined} ServerLanguage
   */
  public getServerLanguage(): string | undefined {
    return this.getStringField("server_language");
  }

  /**
   * Настроен ли почтовый сервер
   * @returns {boolean} статус настроенности почтового сервера
   */
  public isMailConfigured(): boolean {
    return this.getBoolField("is_mail_configured");
  }

  /**
   * Включен ли режим отладки
   */
  public get isDebugMode(): boolean {
    return this.getBoolField("debug_mode");
  }

  /**
   * Используется ли SaaS для входа в систему
   */
  public get isLogonTypeEmail(): boolean {
    return this.getStringField("logon_type") === logonTypes.EMAIL;
  }

  public get isLogonTypeLogin(): boolean {
    return this.getStringField("logon_type") === logonTypes.LOGIN;
  }

  /** Количество сотрудников, по умолчанию отображаемое перед "Показать еще" */
  public get employeesLimitCount() {
    return this.getNumberField("employee_tree_depth");
  }
}

export default SystemCommonModel;

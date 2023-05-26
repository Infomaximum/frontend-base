import { MillisecondsPerSecond } from "@infomaximum/utility";

/**
 * минимальная длина пароля
 */
export const MIN_PASSWORD_LENGTH = 4;

/**
 * Доступные языки
 */
export const LANGUAGE = {
  en: "ENGLISH",
  ru: "RUSSIAN",
} as const;

/** Имя рутовой ноды куда отрисовывается приложение */
export const rootDomNodeName = "root";

/**
 * Имя поля с доп. параметрами ошибки с сервера
 * @type {string}
 */
export const PARAMETERS_FIELD_NAME = "parameters";

export enum EErrorCode {
  GRAPHQL_VALIDATION_ERROR = "graphql_validation_error",
  INVALID_CREDENTIALS = "invalid_credentials",
  EXPIRED_PASSWORD = "expired_password",
  INVALID_LOGON = "INVALID_LOGON",
  NO_PRIVILEGES = "NO_PRIVILEGES",
  DISABLED_LOGON = "disabled_logon",
  INVALID_LOGON_AND_MAX_LOGON_ATTEMPTS_EXCEED = "INVALID_LOGON_AND_MAX_LOGON_ATTEMPTS_EXCEED",

  /** =========================== HTTP [START] =========================== */
  CONNECTION_ERROR = "connection_error",
  BAD_GATEWAY = "bad_gateway",
  GATEWAY_TIMEOUT = "gateway_timeout",
  /** =========================== HTTP [END]=========================== */

  /*** =========================== Для страницы AccessRoles [START]  =========================== ***/
  ASSIGNED_TO_EMPLOYEES_ACCESS_ROLE = "assigned_to_employees_access_role",
  /*** ============================ Для страницы AccessRoles [END]  ============================ ***/

  /*** =========================== Для страницы employee [START]  =========================== ***/
  /** --------------------------------- Departments -------------------------------- **/
  NOT_EMPTY_DOMAIN_OBJECT = "not_empty_domain_object",
  /** ---------------------------------- Employees --------------------------------- **/
  EMPLOYEE_SELF_REMOVE = "employee_self_remove",
  ADMINISTRATOR_EMPLOYEE = "administrator_employee",
  EMPLOYEE_SELF_REMOVE_ROLE_ADMIN = "employee_self_remove_role_admin",
  /** ---------------------------------- Combined ---------------------------------- **/
  EMPLOYEE_SELF_REMOVE_NOT_EMPTY_DEPARTMENT = "employee_self_remove_not_empty_department",
  EMPLOYEE_SELF_REMOVE_ADMIN_NOT_EMPTY_DEPARTMENT = "employee_self_remove_admin_not_empty_department",
  ADMIN_EMPLOYEE_NON_EMPTY_DEPARTMENT = "admin_employee_non_empty_department",

  /*** ============================ Для страницы employee [END]  ============================ ***/
}

export const KeyupRequestInterval = 1500;

export const CollapsibleContentAnimationInterval = 150;
export const ModalAnimationInterval = 300;
export const DropdownAnimationInterval = 300;
export const DrawerAnimationInterval = 300;
export const HoverAnimationInterval = 300;
export const MaxDataReloadInterval = 30 * MillisecondsPerSecond;
export const StepDataReloadInterval = 2 * MillisecondsPerSecond;
export const WebSocketPingPongInterval = 20 * MillisecondsPerSecond;

/** Имя токена авторизации которых хранится в cookie */
export const TOKEN_NAME_COOKIE = "session";

export enum ELimitsStateNames {
  DEFAULT = "count",
  PROGRAM_GROUP = "program_group_settings",
  TASK_GROUP = "task_group_settings",
  PROGRAM = "program_settings",
  GROUP_SETTINGS = "group_settings",
  EMPLOYEE_SETTINGS = "employee_settings",
}

/**
 * В поле с таким названием в объекте {@link PARAMETERS_FIELD_NAME} лежит имя поля, валидация которого не прошла
 * на сервере
 * @type {string}
 */
export const ERROR_FIELD_NAME = "field_name";

/**
 * В поле с таким названием в объекте хранится переданное на сервер значение
 * @type {string}
 */
export const ERROR_FIELD_VALUE = "field_value";

/**
 * Количество отображаемых элементов в списках или таблицах по-умолчанию
 */
export const LimitCount = 20;

/** z-index модального окна подтверждения изменений формы при переходе на другую страницу */
export const Z_INDEX_FORM_CONFIRMATION_MODAL = 5000;

/** Задержка для отображения лоадера, ms */
export const loaderDelay = 750;
export const suffixLoaderDelay = 1500;

export enum ESortDirection {
  descend = "DESC",
  ascend = "ASC",
  ASC = "ascend",
  DESC = "descend",
}

export const contextMenuColumnKey = "context_menu";

/** Для измерения высоты шапки */
export const TABLE_HEADER_ID = "table-header-id";
/** Для работы со скоролом в теле виртуализированной таблицы*/
export const VIRTUALIZED_TABLE_BODY_ID = "virtualized-table-body-id";
/** Для работы со скоролом в контейнере с контентом*/
export const MAIN_LAYOUT_CONTENT_ID = "main-layout-content-id";

export enum EErrorBoundaryCodesBase {
  app = "app",
  unAuthorizedLayout = "unAuthorizedLayout",
}

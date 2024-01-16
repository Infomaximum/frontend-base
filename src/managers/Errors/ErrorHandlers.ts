import type { NCore } from "@infomaximum/module-expander";
import { EErrorCode, ERROR_FIELD_NAME } from "../../utils/const";
import {
  ACCESS_DENIED,
  ACCOUNT_IS_LOCKED,
  CANNOT_DELETE_ACCESS_ROLES_ASSIGNED_TO_USERS,
  CANNOT_DELETE_USERS_WITH_ROLE_ADMIN,
  CANNOT_DELETE_NON_EMPTY_DEPARTMENTS,
  CANNOT_DELETE_YOUR_PROFILE,
  CANNOT_DELETE_YOUR_PROFILE_ADMINISTRATORS_AND_NON_EMPTY_DEPARTMENTS,
  CANNOT_DELETE_YOUR_PROFILE_AND_USERS_WITH_ROLE_ADMIN,
  CANNOT_DELETE_YOUR_PROFILE_AND_NON_EMPTY_DEPARTMENTS,
  CHANGE_ACCESS_ROLES_IN_USER_PROFILES_AND_TRY_AGAIN,
  CHANGE_USER_ACCESS_ROLES_AND_TRY_AGAIN,
  CHECK_YOUR_CONNECTION,
  CONTACT_ADMINISTRATOR_OR_TRY_AGAIN_LATER,
  DELETE_USERS_FROM_DEPARTMENTS_AND_TRY_AGAIN,
  DELETE_USERS_FROM_DEPARTMENTS_CHANGE_USER_ACCESS_ROLES_AND_TRY_AGAIN,
  EXPIRED_PASSWORD,
  GRAPHQL_INVALID_SYNTAX,
  GRAPHQL_VALIDATION_ERROR,
  INCORRECT_CURRENT_PASSWORD,
  INCORRECT_VALUE,
  INTEGRATED_AUTHENTICATION_ALREADY_EXISTS,
  INTEGRATED_AUTHENTICATION_NOT_FOUND,
  INTERNET_CONNECTION_ERROR,
  INVALID_EMAIL_OR_PASS,
  INVALID_LOGON,
  NEW_PASSWORD_EQUALS_CURRENT_PASSWORD,
  NOT_FOUND_DOMAIN_OBJECT,
  NOT_UNIQUE_VALUE,
  NO_PRIVILEGES,
  PASSWORD_RECOVERY_LINK_EXPIRED,
  REQUIRE_ALL_USERS_ACCESS,
  RESTRICTED_ACCESS,
  SERVER_OVERLOADED,
  SERVER_OVERLOADED_DESCRIPTION,
  SERVER_TIMEOUT,
  UNABLE_TO_CONNECT_TO_THE_SERVER,
  YOU_CANNOT_DELETE_ADMIN_AND_DEPARTMENTS_THAT_HAS_USERS,
  YOU_CANNOT_DELETE_DEPARTMENTS_AND_EMPLOYEES,
  NETWORK_FAILURE_OCCURRED,
} from "../../utils/Localization/ErrorLocalization";

export const baseErrorHandlers: NCore.TErrorPreparer[] = [
  {
    code: EErrorCode.CONNECTION_ERROR,
    title: INTERNET_CONNECTION_ERROR,
    description: CHECK_YOUR_CONNECTION,
  },
  {
    code: EErrorCode.BAD_GATEWAY,
    title: UNABLE_TO_CONNECT_TO_THE_SERVER,
    description: CONTACT_ADMINISTRATOR_OR_TRY_AGAIN_LATER,
  },
  {
    code: EErrorCode.GATEWAY_TIMEOUT,
    title: UNABLE_TO_CONNECT_TO_THE_SERVER,
    description: CONTACT_ADMINISTRATOR_OR_TRY_AGAIN_LATER,
  },
  {
    code: "already_active_server",
    description: NOT_UNIQUE_VALUE,
  },
  {
    code: "not_unique_value",
    description: NOT_UNIQUE_VALUE,
  },
  {
    code: "invalid_value",
    description: INCORRECT_VALUE,
  },
  {
    code: "invalid_value",
    params: {
      [ERROR_FIELD_NAME]: "current_password_hash",
    },
    description: INCORRECT_CURRENT_PASSWORD,
  },
  {
    code: "invalid_value",
    params: {
      field_name: "phone_number",
    },
    getError({ error }) {
      return {
        ...error,
        message: "",
      };
    },
  },
  {
    code: EErrorCode.INVALID_LOGON,
    getError({ error, localization }) {
      return {
        ...error,
        message: error?.params?.isLogonTypeEmail
          ? localization.getLocalized(INVALID_EMAIL_OR_PASS)
          : localization.getLocalized(INVALID_LOGON),
      };
    },
  },
  {
    code: "require_all_employee_access",
    description: REQUIRE_ALL_USERS_ACCESS,
  },
  {
    code: EErrorCode.NOT_EMPTY_DOMAIN_OBJECT,
    params: { type: "Department" },
    title: CANNOT_DELETE_NON_EMPTY_DEPARTMENTS,
    description: DELETE_USERS_FROM_DEPARTMENTS_AND_TRY_AGAIN,
  },
  /** =========================== константы для страницы AccessRoles [START]  =========================== */
  {
    code: EErrorCode.ASSIGNED_TO_EMPLOYEES_ACCESS_ROLE,
    title: CANNOT_DELETE_ACCESS_ROLES_ASSIGNED_TO_USERS,
    description: CHANGE_ACCESS_ROLES_IN_USER_PROFILES_AND_TRY_AGAIN,
  },
  /** ============================ errorHandlers для страницы AccessRoles [END]  ============================ */

  /** =========================== errorHandlers для страницы employee [START]  =========================== */
  /** --------------------------------- Departments -------------------------------- */
  {
    code: EErrorCode.NOT_EMPTY_DOMAIN_OBJECT,
    title: CANNOT_DELETE_NON_EMPTY_DEPARTMENTS,
    description: DELETE_USERS_FROM_DEPARTMENTS_AND_TRY_AGAIN,
  },
  /** ---------------------------------- Employees --------------------------------- */
  {
    code: EErrorCode.ADMINISTRATOR_EMPLOYEE,
    title: CANNOT_DELETE_USERS_WITH_ROLE_ADMIN,
    description: CHANGE_USER_ACCESS_ROLES_AND_TRY_AGAIN,
  },
  {
    code: EErrorCode.EMPLOYEE_SELF_REMOVE,
    title: CANNOT_DELETE_YOUR_PROFILE,
  },
  {
    code: EErrorCode.EMPLOYEE_SELF_REMOVE_ROLE_ADMIN,
    title: CANNOT_DELETE_YOUR_PROFILE_AND_USERS_WITH_ROLE_ADMIN,
    description: CHANGE_USER_ACCESS_ROLES_AND_TRY_AGAIN,
  },
  /** ---------------------------------- Combined ---------------------------------- */
  {
    code: EErrorCode.ADMIN_EMPLOYEE_NON_EMPTY_DEPARTMENT,
    title: YOU_CANNOT_DELETE_DEPARTMENTS_AND_EMPLOYEES,
    description: YOU_CANNOT_DELETE_ADMIN_AND_DEPARTMENTS_THAT_HAS_USERS,
  },
  {
    code: EErrorCode.EMPLOYEE_SELF_REMOVE_NOT_EMPTY_DEPARTMENT,
    title: CANNOT_DELETE_YOUR_PROFILE_AND_NON_EMPTY_DEPARTMENTS,
    description: DELETE_USERS_FROM_DEPARTMENTS_AND_TRY_AGAIN,
  },
  {
    code: EErrorCode.EMPLOYEE_SELF_REMOVE_ADMIN_NOT_EMPTY_DEPARTMENT,
    title: CANNOT_DELETE_YOUR_PROFILE_ADMINISTRATORS_AND_NON_EMPTY_DEPARTMENTS,
    description: DELETE_USERS_FROM_DEPARTMENTS_CHANGE_USER_ACCESS_ROLES_AND_TRY_AGAIN,
  },
  /** ============================ errorHandlers для страницы employee [END]  ============================ */
  {
    code: "new_password_equals_current_password",
    description: NEW_PASSWORD_EQUALS_CURRENT_PASSWORD,
  },
  {
    code: EErrorCode.DISABLED_LOGON,
    description: ACCOUNT_IS_LOCKED,
  },
  {
    code: "expired_password",
    description: EXPIRED_PASSWORD,
  },
  {
    code: "server_overloaded",
    title: SERVER_OVERLOADED,
    description: SERVER_OVERLOADED_DESCRIPTION,
    typeDisplayedComponent: "info",
  },
  {
    code: "server_timeout",
    title: SERVER_TIMEOUT,
    typeDisplayedComponent: "info",
  },
  {
    code: "password_recovery_link_expired",
    description: PASSWORD_RECOVERY_LINK_EXPIRED,
  },
  {
    code: EErrorCode.NO_PRIVILEGES,
    description: NO_PRIVILEGES,
  },
  {
    code: "access_denied",
    description: ACCESS_DENIED,
  },
  {
    code: "not_found_domain_object",
    title: NOT_FOUND_DOMAIN_OBJECT,
  },
  {
    code: EErrorCode.GRAPHQL_VALIDATION_ERROR,
    description: GRAPHQL_VALIDATION_ERROR,
  },
  {
    code: EErrorCode.NETWORK_FAILURE_OCCURRED,
    title: NETWORK_FAILURE_OCCURRED,
  },
  {
    code: "graphql_invalid_syntax",
    description: GRAPHQL_INVALID_SYNTAX,
  },
  {
    code: "empty_privileges",
    description: RESTRICTED_ACCESS,
  },
  {
    code: "integrated_authentication_already_exists",
    description: INTEGRATED_AUTHENTICATION_ALREADY_EXISTS,
  },
  {
    code: "integrated_authentication_not_found",
    description: INTEGRATED_AUTHENTICATION_NOT_FOUND,
  },
];

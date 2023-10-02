import type { EOperationType } from "@infomaximum/utility";
import { every, isArray, isString, some } from "lodash";
import type { IWithFeatureProps } from "../decorators/hocs/withFeature/withFeature.types";

export type TAccessRules = { [key: string]: EOperationType[] } | string;

/**
 * Функция определяет наличие доступа,
 * при передаче массива - наличие хотя бы одного из доступов массива.
 */
export function isShowElement(
  accessRules: TAccessRules | TAccessRules[] | undefined,
  isFeatureEnabled: Required<IWithFeatureProps>["isFeatureEnabled"]
) {
  const checkAccess = (accessRules: TAccessRules | undefined) =>
    isString(accessRules)
      ? isFeatureEnabled(accessRules)
      : every(accessRules, (accessTypes: EOperationType[], accessKey) =>
          every(accessTypes, (accessType) => isFeatureEnabled(accessKey, { accessType }))
        );

  return isArray(accessRules) ? some(accessRules, checkAccess) : checkAccess(accessRules);
}

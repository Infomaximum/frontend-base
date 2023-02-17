import type { EOperationType } from "@im/utils";
import { every, isArray, some } from "lodash";
import type { IWithFeatureProps } from "../decorators/hocs/withFeature/withFeature.types";

export type TAccessRules = { [key: string]: EOperationType[] };

/**
 * Функция определяет наличие доступа,
 * при передаче массива - наличие хотя бы одного из доступов массива.
 */
export function isShowElement(
  accessRules: TAccessRules | TAccessRules[] | undefined,
  isFeatureEnabled: Required<IWithFeatureProps>["isFeatureEnabled"]
) {
  const checkAccess = (accessRules: TAccessRules | undefined) =>
    every(accessRules, (accessTypes: EOperationType[], accessKey) =>
      every(accessTypes, (accessType) => isFeatureEnabled(accessKey, { accessType }))
    );

  return isArray(accessRules) ? some(accessRules, checkAccess) : checkAccess(accessRules);
}

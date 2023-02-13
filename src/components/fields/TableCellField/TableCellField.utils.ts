import { eq, isNull } from "lodash";

export const hasAutoFocus = (
  name: string,
  focusedName: string | null,
  hasFocusByDefault: boolean
) => {
  const isFocusByDefault = isNull(focusedName);

  if (isFocusByDefault) {
    return hasFocusByDefault;
  }

  return eq(focusedName, name);
};

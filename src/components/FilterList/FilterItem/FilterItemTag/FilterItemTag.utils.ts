import { isBoolean, toLower } from "lodash";
import { useEffect, useState } from "react";
import { useLocalization } from "@infomaximum/base/src/decorators";
import { NOT } from "@infomaximum/base/src/utils";

export const useTagValue = (caption: string, children: React.ReactNode) => {
  const localization = useLocalization();
  const [tagState, setTagState] = useState<string>();
  useEffect(() => {
    setTagState(
      isBoolean(children)
        ? children
          ? caption
          : `${localization.getLocalized(NOT)} ${toLower(caption)}`
        : `${caption}${caption && children && ": "}${children}`
    );
  }, [caption, children, localization]);

  return tagState;
};

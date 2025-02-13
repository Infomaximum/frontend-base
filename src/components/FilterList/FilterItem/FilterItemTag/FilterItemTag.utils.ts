import { isBoolean, toLower } from "lodash";
import { useEffect, useState } from "react";
import { useLocalization } from "../../../../decorators";
import { NOT } from "../../../../utils";

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

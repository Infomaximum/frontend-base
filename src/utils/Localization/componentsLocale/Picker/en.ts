import enUS from "rc-picker/es/locale/en_US";
import type { PickerLocale } from "@infomaximum/ui-kit";

export const pickerEnLocale: PickerLocale = {
  ...enUS,
  datePlaceholder: "Select date",
  monthPlaceholder: "Select month",
  weekPlaceholder: "Select week",
  rangeDatePlaceholder: ["Start date", "End date"],
};

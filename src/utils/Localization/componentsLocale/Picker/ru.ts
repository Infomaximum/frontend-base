import ruRU from "rc-picker/es/locale/ru_RU";
import type { PickerLocale } from "@infomaximum/ui-kit";

export const pickerRuLocale: PickerLocale = {
  ...ruRU,
  datePlaceholder: "Выберите дату",
  monthPlaceholder: "Выберите месяц",
  weekPlaceholder: "Выберите неделю",
  rangeDatePlaceholder: ["Начальная дата", "Конечная дата"],
};

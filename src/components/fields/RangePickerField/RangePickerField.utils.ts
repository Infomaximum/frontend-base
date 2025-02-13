import { map } from "lodash";
import dayjs, { type Dayjs } from "dayjs";
import {
  START_DATE,
  END_DATE,
  START_MONTH,
  END_MONTH,
} from "../../../utils/Localization/Localization";
import type { TPickerValue } from "./RangePickerField.types";
import type { Localization } from "@infomaximum/localization";

const getPreparedValue = (timestampRange: [number, number]) =>
  timestampRange
    ? (map(timestampRange, (timestamp) => dayjs.unix(timestamp)) as [Dayjs, Dayjs])
    : null;

const getRangePickerReadOnlyValue = (range: [Dayjs, Dayjs], format: string) => {
  return range ? map(range, (value) => value.format(format)).join(" — ") : null;
};

const getPlaceholder = (localization: Localization): [string, string] => [
  localization.getLocalized(START_DATE),
  localization.getLocalized(END_DATE),
];

const getPlaceholderLocalizationByPicker = (
  picker: TPickerValue | undefined,
  localization: Localization
): [string, string] | undefined => {
  switch (picker) {
    case "month":
      return [localization.getLocalized(START_MONTH), localization.getLocalized(END_MONTH)];
    default:
      return;
  }
};

export {
  getPlaceholderLocalizationByPicker,
  getPlaceholder,
  getRangePickerReadOnlyValue,
  getPreparedValue,
};

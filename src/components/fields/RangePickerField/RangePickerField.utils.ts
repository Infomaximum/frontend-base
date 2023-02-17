import { map } from "lodash";
import type { Moment } from "moment";
import moment from "moment";
import {
  START_DATE,
  END_DATE,
  START_MONTH,
  END_MONTH,
} from "../../../utils/Localization/Localization";
import type { TPickerValue } from "./RangePickerField.types";
import type { Localization } from "@im/localization";

const getPreparedValue = (timestampRange: [number, number]) =>
  timestampRange
    ? (map(timestampRange, (timestamp) => moment.unix(timestamp)) as [Moment, Moment])
    : null;

const getRangePickerReadOnlyValue = (range: [Moment, Moment], format: string) => {
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

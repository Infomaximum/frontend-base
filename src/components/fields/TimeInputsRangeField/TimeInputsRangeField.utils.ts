import { compact, isEmpty, size } from "lodash";
import { TestIdsUtils } from "@infomaximum/utility";
import type { TTimeInputsRangeValue } from "./TimeInputsRangeField.types";

export const customRangeValueValidator = (values: TTimeInputsRangeValue) => {
  const filledValues = compact(values);

  if (isEmpty(filledValues)) {
    return { code: TestIdsUtils.FIELD_EMPTY };
  }
};

export const emptyRangeValueValidator = (values: TTimeInputsRangeValue) => {
  const filledValues = compact(values);

  if (isEmpty(filledValues) || size(filledValues) !== 2) {
    return { code: TestIdsUtils.FIELD_EMPTY };
  }
};

export const correctRangeValueValidator = (values: TTimeInputsRangeValue) => {
  const filledValues = compact(values) as
    | [plugin.Duration]
    | [plugin.Duration, plugin.Duration]
    | [];

  if (filledValues.length === 0) {
    return;
  }

  if (filledValues.length !== 2) {
    return { code: TestIdsUtils.FIELD_EMPTY };
  }

  const [begin, end] = filledValues;
  const beginDuration = begin;
  const endDuration = end;

  if (Number(endDuration) === 0) {
    // возможность задать время окончания диапазона 00:00
    return;
  }

  if (beginDuration >= endDuration) {
    return { code: TestIdsUtils.FIELD_EMPTY };
  }
};

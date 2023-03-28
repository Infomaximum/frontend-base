import { compact, isEmpty, size } from "lodash";
import moment from "moment";
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
  const filledValues = compact(values);

  if (isEmpty(filledValues)) {
    return;
  }

  if (size(filledValues) !== 2) {
    return { code: TestIdsUtils.FIELD_EMPTY };
  }

  const [begin, end] = filledValues;
  const beginDuration = moment.duration(begin);
  const endDuration = moment.duration(end);

  if (Number(endDuration) === 0) {
    // возможность задать время окончания диапазона 00:00
    return;
  }

  if (beginDuration >= endDuration) {
    return { code: TestIdsUtils.FIELD_EMPTY };
  }
};

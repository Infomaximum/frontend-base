import { type ChangeEvent, type FC, useCallback, useMemo, useState } from "react";
import { Space } from "antd";
import type {
  ITimeInputsRangeFieldProps,
  ITimeInputsRangeFormFieldProps,
  ITimeInputsRangeProps,
} from "./TimeInputsRangeField.types";
import { eq, isNil, map } from "lodash";
import moment, { type Duration, isDuration } from "moment";
import {
  dashStyle,
  timeInputStyle,
  timeInputWithSecondsStyle,
} from "./TimeInputsRangeField.styles";
import { timeInputsRangeTestId } from "../../../utils/TestIds";
import { formatEnteredTime, type TDurationDescription } from "@im/utils";
import { Input } from "../../Input";
import { Field, FormField } from "../FormField";

enum EMomentFormat {
  HH_mm = "HH:mm",
  HH_mm_ss = "HH:mm:ss",
}

enum ECountOfDigits {
  HH_mm = EMomentFormat.HH_mm.length,
  HH_mm_ss = EMomentFormat.HH_mm_ss.length,
}

const TimeInputsRange: FC<ITimeInputsRangeProps> = (props) => {
  const { input, readOnly, withSeconds, isExcludeLowValues = true, disabled } = props;

  const FIELD_CONST = useMemo(
    () => ({
      inputNames: {
        BEGIN: "begin",
        END: "end",
      },
      format: withSeconds ? EMomentFormat.HH_mm_ss : EMomentFormat.HH_mm,
    }),
    [withSeconds]
  );

  const initialInputs = useMemo(() => {
    const [begin, end] = input.value as [
      null | TDurationDescription | Duration,
      null | TDurationDescription | Duration
    ];

    const resultInitialValues = [] as unknown as [string, string];

    if (isNil(begin)) {
      resultInitialValues.push("");
    } else if (isDuration(begin)) {
      const milliseconds = begin.asMilliseconds();

      if (milliseconds > 0 && milliseconds <= 9) {
        resultInitialValues.push("");
      } else {
        resultInitialValues.push(moment.utc(milliseconds).format(FIELD_CONST.format));
      }
    } else {
      resultInitialValues.push(moment(begin).format(FIELD_CONST.format));
    }

    if (isNil(end)) {
      resultInitialValues.push("");
    } else if (isDuration(end)) {
      const milliseconds = end.asMilliseconds();

      if (milliseconds > 0 && milliseconds <= 9) {
        resultInitialValues.push("");
      } else {
        resultInitialValues.push(moment.utc(milliseconds).format(FIELD_CONST.format));
      }
    } else {
      resultInitialValues.push(moment(end).format(FIELD_CONST.format));
    }

    return resultInitialValues;
  }, [FIELD_CONST.format, input.value]);

  const [inputValues, setInputValues] = useState<[string, string]>(initialInputs);

  const handleChange = useCallback(
    ({ target: { value, name } }: ChangeEvent<HTMLInputElement>) => {
      const { inputNames, format } = FIELD_CONST;
      const [begin, end] = inputValues;

      const nextValues = eq(name, inputNames.BEGIN)
        ? ([formatEnteredTime(value), end] as [string, string])
        : ([begin, formatEnteredTime(value)] as [string, string]);

      setInputValues(nextValues);

      const parseFormValue = (str: string) => {
        if (!moment(str, format).isValid()) {
          return null;
        }

        const duration = moment.duration(str);

        if (isExcludeLowValues) {
          const durationInMilliseconds = duration.asMilliseconds();

          if (durationInMilliseconds > 0 && durationInMilliseconds <= 9) {
            return null;
          }
        }

        return duration;
      };

      input.onChange(map(nextValues, parseFormValue));
    },
    [input, inputValues, FIELD_CONST, isExcludeLowValues]
  );

  const placeholder = useMemo(
    () => moment().startOf("day").format(FIELD_CONST.format),
    [FIELD_CONST]
  );

  const {
    inputNames: { BEGIN, END },
  } = FIELD_CONST;

  const handleBlur = useMemo(() => input.onBlur, [input.onBlur]);

  return (
    <Space size={6} test-id={timeInputsRangeTestId}>
      <Input
        test-id={`${timeInputsRangeTestId}_${BEGIN}`}
        name={BEGIN}
        css={withSeconds ? timeInputWithSecondsStyle : timeInputStyle}
        readOnly={readOnly}
        value={inputValues[0]}
        onChange={handleChange}
        placeholder={placeholder}
        autoComplete="off"
        maxLength={withSeconds ? ECountOfDigits.HH_mm_ss : ECountOfDigits.HH_mm}
        disabled={disabled}
        onBlur={handleBlur}
      />
      <span css={dashStyle}>—</span>
      <Input
        test-id={`${timeInputsRangeTestId}_${END}`}
        name={END}
        css={withSeconds ? timeInputWithSecondsStyle : timeInputStyle}
        readOnly={readOnly}
        value={inputValues[1]}
        onChange={handleChange}
        placeholder={placeholder}
        autoComplete="off"
        maxLength={withSeconds ? ECountOfDigits.HH_mm_ss : ECountOfDigits.HH_mm}
        disabled={disabled}
        onBlur={handleBlur}
      />
    </Space>
  );
};

const TimeInputsRangeField: FC<ITimeInputsRangeFieldProps> = (props) => {
  return <Field component={TimeInputsRange} {...props} />;
};

const TimeInputsRangeFormField: FC<ITimeInputsRangeFormFieldProps> = (props) => {
  return <FormField component={TimeInputsRangeField} {...props} />;
};

export { TimeInputsRangeFormField };

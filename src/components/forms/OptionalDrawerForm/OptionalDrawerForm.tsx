import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SelectFormField, SelectFieldComponent } from "../../fields/SelectField/SelectField";
import type { IOptionalDrawerFormProps } from "./OptionalDrawerForm.types";
import { filter, first, gt, map, size } from "lodash";
import type { IDrawerFormProps } from "../DrawerForm/DrawerForm.types";
import { extractActiveContent, optionalDrawerFormSelect } from "./OptionalDrawerForm.utils";
import {
  contentWrapperStyle,
  headerStyle,
  selectWrapperStyle,
  stretchStyle,
} from "./OptionalDrawerForm.styles";
import { optionalDrawerFormSelectTestId } from "../../../utils/TestIds";
import { useLocalization } from "../../../decorators/hooks/useLocalization";
import { useForm } from "../../../decorators/hooks/useForm";
import { DrawerForm } from "../DrawerForm/DrawerForm";

const { Option } = SelectFormField;

/**
 * Обертка вокруг дровера с формой, позволяющая, в зависимости от выбранной опции,
 * рендерить разный контент и по-разному обрабатывать submit
 */
const OptionalDrawerFormComponent: React.FC<IOptionalDrawerFormProps> = ({
  optionsConfig,
  defaultOption = first(optionsConfig)?.value,
  contents,
  defaultContent,
  onSubmit,
  initialValues: propsInitialValues,
  disableSubmitFormButton,
  disableSubmitFormButtonOnEmpty,
  form,
  setFormData: outerSetFormData,
  ...restProps
}) => {
  const localization = useLocalization();
  const [activeOption, setActiveOption] = useState<string>();
  const [isValid, setIsValid] = useState(true);

  const { setFormData, formData } = useForm<TDictionary>(
    ({ values, valid }) => {
      setIsValid(valid);
      setActiveOption(values[optionalDrawerFormSelect]);
    },
    { values: true, valid: true }
  );

  useEffect(() => {
    if (formData) {
      outerSetFormData?.(formData);
    }
  }, [formData, outerSetFormData]);

  const handleSubmit: IDrawerFormProps["onSubmit"] = useCallback(
    ({ [optionalDrawerFormSelect]: selectedOption, ...restValues }) =>
      onSubmit(restValues, selectedOption),
    [onSubmit]
  );

  const initialValues = useMemo(
    () => ({
      ...propsInitialValues,
      [optionalDrawerFormSelect]: defaultOption,
    }),
    [propsInitialValues, defaultOption]
  );

  const selectOptions = useMemo(
    () =>
      map(filter(optionsConfig, "label"), ({ label, value, disabled }) => (
        <Option key={value} test-id={`select-option-${value}`} value={value} disabled={disabled}>
          <span title={undefined}>{label}</span>
        </Option>
      )),
    [optionsConfig]
  );

  const select = gt(size(selectOptions), 1) ? (
    <div css={selectWrapperStyle}>
      <SelectFieldComponent
        defaultValue={defaultOption}
        key={optionalDrawerFormSelect}
        name={optionalDrawerFormSelect}
        css={stretchStyle}
        localization={localization}
        test-id={optionalDrawerFormSelectTestId}
      >
        {selectOptions}
      </SelectFieldComponent>
    </div>
  ) : null;

  const { inlineContent, mainContent } =
    extractActiveContent(activeOption, contents) ?? defaultContent ?? {};

  const header = Boolean(select || inlineContent) ? (
    <div css={headerStyle}>
      {select}
      {inlineContent}
    </div>
  ) : null;

  const isDisabledSubmitBtn = () => {
    if (!isValid) {
      return true;
    }

    if (
      activeOption &&
      activeOption !== initialValues[optionalDrawerFormSelect] &&
      !disableSubmitFormButtonOnEmpty
    ) {
      return false;
    }

    return disableSubmitFormButtonOnEmpty || disableSubmitFormButton;
  };

  return (
    <DrawerForm
      {...restProps}
      form={form}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      setFormData={setFormData}
      // Если контент пуст, то принудительное переопределение состояние submit игнорируется
      disableSubmitFormButton={isDisabledSubmitBtn()}
    >
      <div style={contentWrapperStyle}>
        {header}
        {mainContent}
      </div>
    </DrawerForm>
  );
};

export const OptionalDrawerForm = OptionalDrawerFormComponent;

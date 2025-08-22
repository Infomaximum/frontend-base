import React, { type FC, memo, useCallback } from "react";
import { isEmpty, isFunction, isNil, map, xor } from "lodash";
import {
  defaultSelectFieldStyle,
  defaultWrapperComponentStyle,
} from "./SelectWithStoreField.styles";
import type {
  ISelectWithStoreComponentProps,
  ISelectWithStoreFieldProps,
  ISelectWithStoreFormFieldProps,
} from "./SelectWithStoreField.types";
import { useLocalization } from "@infomaximum/base/src/decorators/hooks/useLocalization";
import type { ISelectWithStoreProps } from "@infomaximum/base/src/components/SelectWithStore/SelectWithStore.types";
import { Input } from "@infomaximum/base/src/components/Input/Input";
import { NOT_SELECTED } from "@infomaximum/base/src/utils/Localization/Localization";
import { SelectWithStore } from "@infomaximum/base/src/components/SelectWithStore/SelectWithStore";
import { Field, FormField } from "../FormField";
import type { IModel } from "@infomaximum/graphql-model";

const isSameValue = (currentValue: IModel[], initialValue: IModel[]) => {
  const initialInnerNames = map(initialValue, (item) => item.getInnerName());
  const currentInnerNames = map(currentValue, (item) => item.getInnerName());

  return isEmpty(xor(initialInnerNames, currentInnerNames));
};

const SelectWithStoreComponent: FC<ISelectWithStoreComponentProps> = memo((props) => {
  const {
    readOnly,
    disabled,
    input: { onBlur, value: valueProps, onChange, onFocus, ...restInput },
    store,
    onChangeCallback,
    suffixIcon,
    ...rest
  } = props;
  const isDisabled = readOnly || disabled;
  const localization = useLocalization();

  const handleChange = useCallback<NonNullable<ISelectWithStoreProps["onChange"]>>(
    (value) => {
      if (isFunction(onChange)) {
        onChange(value);
      }

      if (isFunction(onChangeCallback)) {
        onChangeCallback(value);
      }
    },
    [onChange, onChangeCallback]
  );

  const handleFocus = useCallback(() => {
    if (isFunction(onFocus)) {
      onFocus();
    }
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    if (isFunction(onBlur)) {
      onBlur();
    }
  }, [onBlur]);

  if (localization && readOnly && isNil(valueProps)) {
    return <Input value={localization.getLocalized(NOT_SELECTED)} disabled={true} />;
  }

  return (
    <SelectWithStore
      {...rest}
      {...restInput}
      // Т.к. final-form не может различать в качестве значения "" и undefined,
      // то для корректной работы применяется такое преобразование
      value={valueProps === "" ? undefined : valueProps}
      onChange={handleChange}
      disabled={isDisabled}
      suffixIcon={readOnly ? null : suffixIcon}
      store={store}
      css={defaultSelectFieldStyle}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
});

const SelectWithStoreField: React.FC<ISelectWithStoreFieldProps> = (props) => (
  <Field component={SelectWithStoreComponent} isEqual={isSameValue} {...props} />
);

class SelectWithStoreFormField extends React.PureComponent<ISelectWithStoreFormFieldProps> {
  public static defaultProps = {
    wrapperComponentStyle: defaultWrapperComponentStyle,
  };

  public override render() {
    return (
      <FormField
        component={SelectWithStoreField}
        wrapperComponentStyle={this.props.wrapperComponentStyle}
        {...this.props}
      />
    );
  }
}

export { SelectWithStoreFormField, SelectWithStoreField };

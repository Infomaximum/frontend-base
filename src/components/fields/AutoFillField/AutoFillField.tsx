import { every, isEqual } from "lodash";
import { wrapperAutoFillStyle } from "./AutoFillField.styles";
import type { FC } from "react";
import { AutoFillComponent } from "./AutoFillComponent";
import type {
  IAutoFillFieldProps,
  IAutoFillFormFieldProps,
  IAutoFillProps,
} from "./AutoFillField.types";
import { useFeature } from "../../../decorators/hooks/useFeature";
import { Field } from "../FormField/Field/Field";
import { FormField } from "../FormField/FormField";
import type { ICommonTableCellProps } from "../TableCellField/TableCellField.types";
import { TableCellField } from "../TableCellField/TableCellField";

const WrapperAutoFillComponent: FC<IAutoFillProps> = ({
  input,
  meta,
  dataAccessKeys,
  ...rest
}) => {
  const { isFeatureEnabled } = useFeature();

  const isHasAccess =
    !!isFeatureEnabled &&
    every(dataAccessKeys, (accessKey) => isFeatureEnabled(accessKey));

  return <AutoFillComponent isHasAccess={isHasAccess} {...rest} {...input} />;
};

const AutoFillField: React.FC<IAutoFillFieldProps> = (props) => (
  <Field component={WrapperAutoFillComponent} isEqual={isEqual} {...props} />
);

const AutoFillFormField: React.FC<IAutoFillFormFieldProps> = (props) => (
  <FormField
    component={AutoFillField}
    wrapperComponentStyle={wrapperAutoFillStyle}
    {...props}
  />
);

const AutoFillTableCellField: React.FC<
  IAutoFillFieldProps & ICommonTableCellProps
> = (props) => <TableCellField component={AutoFillField} {...props} />;

export { AutoFillFormField, AutoFillField, AutoFillTableCellField };

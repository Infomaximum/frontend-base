import React from "react";
import type {
  ITextAreaFieldProps,
  ITextAreaProps,
  ITextAreaFormFieldProps,
} from "./TextAreaField.types";
import type { TextAreaRef } from "antd/lib/input/TextArea";
import {
  textAreaFieldStyles,
  textAreaWrapperStyle,
} from "./TextAreaField.styles";
import { Field, FormField } from "../FormField";
import { Input } from "../../Input";

const TextArea = Input.TextArea;

/**
 * Класс обёртка для работы фокуса через dispatch
 * А так же для возможности установки и получения положения курсора
 */
class TextAreaWrapper extends React.PureComponent<ITextAreaProps> {
  private textAreaRef = React.createRef<TextAreaRef>();
  private isFirst: boolean = true;
  public static defaultProps = {
    rows: 1,
  };

  public override componentDidUpdate(prevProps: ITextAreaProps) {
    const { meta } = this.props;
    if (this.textAreaRef.current && meta) {
      if ((!prevProps.meta || !prevProps.meta.active) && meta.active) {
        this.isFirst = false;
        this.textAreaRef.current.focus();
      }
    }
  }

  private getTextAreaRef() {
    return this.textAreaRef?.current?.resizableTextArea?.textArea;
  }

  public override render() {
    const { input, meta, setTextAreaProvider, rows, ...rest } = this.props;

    const { disabled, readOnly } = this.props;

    return (
      <div css={textAreaWrapperStyle}>
        <TextArea
          {...input}
          {...rest}
          disabled={disabled || readOnly}
          ref={this.textAreaRef}
          style={textAreaFieldStyles}
          rows={rows}
        />
      </div>
    );
  }
}

const TextAreaField: React.FC<ITextAreaFieldProps> = (
  props: ITextAreaFieldProps
) => {
  return <Field component={TextAreaWrapper} {...props} />;
};

const TextAreaFormField: React.FC<ITextAreaFormFieldProps> = (props) => {
  return <FormField component={TextAreaField} {...props} />;
};

export { TextAreaFormField };

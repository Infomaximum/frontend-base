import type { IModel } from "@im/models";
import type { SelectProps } from "antd";
import type React from "react";
import type { IWithLocProps } from "../../../../decorators/hocs/withLoc/withLoc";

type TAntSelectProps = Omit<SelectProps<any>, "value" | "onChange" | "notFoundContent">;

export interface ISelectOwnProps extends TAntSelectProps {
  value?: IModel[];
  onSuffixClick?(e?: React.SyntheticEvent<Element>): void;
  onBlur?(): void;
  onFocus?(): void;
  onChange(value?: IModel[]): void;
  hintContainer?: React.ReactNode;
  /**
   * обработчик отображаемых значений в автокомплите/селекте
   */
  handlerDisplayValues?: (value: IModel) => React.ReactNode;
  /**
   * обработчик всплывающих значений в автокомплите/селекте
   */
  handlerTitleValues?: (value: IModel) => string;
  /**
   * обработчик отображения выбранных значений в автокомплите/селекте
   * (нужен что бы перехватить значение initialValues)
   */
  handlerDisplaySelectedValues?: (value: IModel) => React.ReactNode;

  labelPropsGetter?: (
    value: IModel
  ) => React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
  "test-id"?: string;
}

export interface IStateProps {
  modelsList?: TDictionary<IModel>;
}

export interface ISelectProps extends ISelectOwnProps, IStateProps, IWithLocProps {}

export interface ISelectState {
  firstLoading: boolean;
}

export interface IValue {
  key: string;
  label: string | React.ReactNode;
}

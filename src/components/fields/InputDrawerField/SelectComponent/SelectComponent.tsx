import React from "react";
import { map, isUndefined, isEmpty } from "lodash";
import { createSelector } from "reselect";
import type { LabeledValue } from "antd/lib/select";
import {
  hintContainerStyle,
  iconBarsDrawerStyle,
  closeCircleStyle,
  inputSelectedContentStyle,
  dropdownStyle,
} from "./SelectComponent.styles";
import {
  inputDrawerSelectSuffixButtonTestId,
  inputDrawerSelectTestId,
} from "../../../../utils/TestIds";
import type { ISelectProps, ISelectState } from "./SelectComponent.types";
import { observer } from "mobx-react";
import { CloseCircleFilled } from "../../../Icons/Icons";
import type { Localization } from "@infomaximum/localization";
import type { IModel } from "@infomaximum/graphql-model";
import { Tooltip } from "../../../Tooltip";
import { NOT_SELECTED } from "../../../../utils/Localization/Localization";
import { BarsSVG } from "../../../../resources/icons";
import { Select } from "../../../Select/Select";
import { withLoc } from "../../../../decorators/hocs/withLoc/withLoc";

class _SelectComponent extends React.PureComponent<ISelectProps, ISelectState> {
  public static defaultProps = {
    showArrow: true,
  };

  public static clearIcon = (<CloseCircleFilled css={closeCircleStyle} />);

  constructor(props: ISelectProps) {
    super(props);

    this.state = {
      firstLoading: false,
    };
  }

  public override componentDidUpdate(prevProps: Readonly<ISelectProps>): void {
    if (prevProps.loading && !this.props.loading && this.state.firstLoading) {
      this.setState({ firstLoading: false });
    }
  }

  private getSelectValue = createSelector(
    (localization) => localization,
    (localization: Localization, fieldValue: IModel[] | undefined) => fieldValue,
    (localization, fieldValue) => {
      const { handlerDisplaySelectedValues, handlerTitleValues, labelPropsGetter } = this.props;

      return fieldValue
        ? map(fieldValue, (model) => {
            const displayValue = handlerDisplaySelectedValues
              ? handlerDisplaySelectedValues(model)
              : model?.getDisplayName();

            const labelProps = labelPropsGetter ? labelPropsGetter(model) : null;

            const title = handlerTitleValues ? handlerTitleValues(model) : model?.getDisplayName();

            return {
              value: model?.getInnerName(),
              label: (
                <div css={inputSelectedContentStyle} {...labelProps}>
                  <Tooltip title={title}>
                    {displayValue || localization.getLocalized(NOT_SELECTED)}
                  </Tooltip>
                </div>
              ),
            };
          })
        : [];
    }
  );

  private getSuffixIcon() {
    const { onSuffixClick, disabled } = this.props;
    const { firstLoading } = this.state;

    if (firstLoading || !onSuffixClick) {
      // отобразится стандартная иконка
      return;
    }

    return (
      <div
        key="select-suffix"
        onClick={disabled ? undefined : onSuffixClick}
        css={iconBarsDrawerStyle}
        test-id={inputDrawerSelectSuffixButtonTestId}
      >
        <BarsSVG />
      </div>
    );
  }

  private handleSelect = (selectStruct: LabeledValue): void => {
    const { onChange, mode, modelsList, value: fieldValue = [] } = this.props;

    if (mode === "multiple" && modelsList) {
      const resultValue: IModel[] = [...fieldValue];

      const selectedModel = modelsList[selectStruct.value];

      if (selectedModel) {
        resultValue.push(selectedModel);
      }

      onChange(resultValue);
    }
  };

  private handleDeselect = (selectStruct: LabeledValue): void => {
    const { onChange, mode, value: fieldValue = [] } = this.props;

    if (mode === "multiple") {
      const selectedModelsCount = fieldValue.length;
      const resultValue: IModel[] = Array(selectedModelsCount ? selectedModelsCount - 1 : 0);

      for (let i = 0, j = 0; i < selectedModelsCount; i += 1) {
        if (fieldValue[i]?.getInnerName() !== selectStruct.value) {
          const value = fieldValue[i];

          if (value) {
            resultValue[j] = value;
          }

          j += 1;
        }
      }

      onChange(resultValue);
    }
  };

  private handleChange = (selectStruct?: LabeledValue): void => {
    const { onChange, mode, modelsList } = this.props;

    const selectedModel = selectStruct && modelsList?.[selectStruct.value];

    if (isUndefined(mode)) {
      if (isUndefined(selectStruct)) {
        onChange();
      } else if (selectedModel) {
        onChange([selectedModel]);
      }
    }
  };

  private handleClick = (): void => {
    const { onSuffixClick } = this.props;

    if (typeof onSuffixClick === "function") {
      onSuffixClick();
    }
  };

  private getDropdownRenderContent(): React.ReactElement {
    return undefined as unknown as React.ReactElement; // костыль для скрытия дропдауна
  }

  public override render(): React.ReactNode {
    const {
      mode: antSelectMode,
      placeholder,
      value: fieldValue,
      onFocus,
      onBlur,
      disabled,
      hintContainer,
      localization,
      allowClear,
      showArrow,
      autoFocus,
      style,
      tagRender,
      getPopupContainer,
    } = this.props;

    let value: LabeledValue[] = this.getSelectValue(localization, fieldValue);
    let mode = antSelectMode;

    if (disabled && isEmpty(value)) {
      value = [
        {
          label: localization.getLocalized(NOT_SELECTED),
          value: undefined as any,
        },
      ];

      mode = undefined;
    }

    return (
      <>
        <Select<LabeledValue[]>
          key="ant-select"
          mode={mode}
          placeholder={placeholder}
          loading={this.state.firstLoading}
          labelInValue={true}
          value={value}
          onBlur={onBlur}
          allowClear={allowClear}
          onFocus={onFocus}
          showSearch={false}
          filterOption={false}
          showArrow={showArrow}
          disabled={disabled}
          dropdownRender={this.getDropdownRenderContent}
          dropdownStyle={dropdownStyle}
          suffixIcon={this.getSuffixIcon()}
          clearIcon={SelectComponent.clearIcon}
          // @ts-expect-error
          onChange={this.handleChange}
          onSelect={this.handleSelect}
          onDeselect={this.handleDeselect}
          onClick={disabled ? undefined : this.handleClick}
          autoFocus={autoFocus}
          test-id={this.props["test-id"] ?? inputDrawerSelectTestId}
          style={style}
          tagRender={tagRender}
          getPopupContainer={getPopupContainer}
        />
        <div css={hintContainerStyle}>{hintContainer}</div>
      </>
    );
  }
}

const SelectComponent = withLoc(observer(_SelectComponent));

export { SelectComponent };

import { AutoComplete as AntAutoComplete, Spin } from "antd";
import hoistNonReactStatics from "hoist-non-react-statics";
import { isFunction, noop } from "lodash";
import { FC, useCallback, useMemo, useRef } from "react";
import type { IAutoCompleteProps } from "./AutoComplete.types";
import { useSelectDropdownPosition } from "../../components/Select/Select.utils";
import { suffixIconSpinnerStyle } from "./AutoComplete.styles";
import { suffixLoaderDelay } from "../../utils/const";
import { useDelayedTrue } from "../../decorators/hooks/useDelayedTrue";

const AutoComplete: FC<IAutoCompleteProps> = (props) => {
  const {
    dropdownRender,
    listItemHeight,
    getPopupContainer,
    suffixIcon: suffixIconProps,
    loading: loadingProps = false,
    onDropdownVisibleChange,
  } = props;
  const loadingState = useDelayedTrue(loadingProps, suffixLoaderDelay);

  const fieldWrapperRef = useRef<HTMLDivElement>(null);

  const dropdownConfig = { itemHeight: listItemHeight } as const;
  const dropdownPosition = useSelectDropdownPosition(
    fieldWrapperRef,
    dropdownConfig,
    "left"
  );

  const computeDropdownPosition = isFunction(dropdownRender)
    ? noop
    : dropdownPosition.compute;

  const handleDropdownVisibleChange = useCallback(
    (shouldOpen: boolean) => {
      if (shouldOpen) {
        computeDropdownPosition(getPopupContainer);
      }

      onDropdownVisibleChange?.(shouldOpen);
    },
    [onDropdownVisibleChange, computeDropdownPosition, getPopupContainer]
  );

  const suffixIcon = useMemo(() => {
    if (loadingState) {
      return (
        <div css={suffixIconSpinnerStyle}>
          <Spin size="small" />
        </div>
      );
    }

    if (suffixIconProps) {
      return suffixIconProps;
    }
  }, [loadingState, suffixIconProps]);

  return (
    <div ref={fieldWrapperRef}>
      <AntAutoComplete
        {...props}
        listHeight={dropdownPosition.listHeight}
        dropdownAlign={dropdownPosition.align}
        suffixIcon={suffixIcon}
        onDropdownVisibleChange={handleDropdownVisibleChange}
      />
    </div>
  );
};

export default hoistNonReactStatics(AutoComplete, AntAutoComplete);

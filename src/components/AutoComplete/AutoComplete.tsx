import { AutoComplete as AntAutoComplete } from "antd";
import hoistNonReactStatics from "hoist-non-react-statics";
import { isFunction, noop } from "lodash";
import { type FC, useCallback, useMemo, useRef } from "react";
import type { IAutoCompleteProps } from "./AutoComplete.types";
import { useSelectDropdownPosition } from "@infomaximum/base/src/components/Select/Select.utils";
import { suffixIconSpinnerStyle } from "./AutoComplete.styles";
import { suffixLoaderDelay } from "@infomaximum/base/src/utils/const";
import { LocalSpinner } from "../Spinner/LocalSpinner/LocalSpinner";
import { useDelayedTrue } from "@infomaximum/base/src/decorators/hooks/useDelayedTrue";

const AutoCompleteComponent: FC<IAutoCompleteProps> = (props) => {
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
  const dropdownPosition = useSelectDropdownPosition(fieldWrapperRef, dropdownConfig, "left");

  const computeDropdownPosition = isFunction(dropdownRender) ? noop : dropdownPosition.compute;

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
          <LocalSpinner delay={0} />
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

export const AutoComplete = hoistNonReactStatics(
  AutoCompleteComponent,
  AntAutoComplete
) as typeof AutoCompleteComponent & typeof AntAutoComplete;

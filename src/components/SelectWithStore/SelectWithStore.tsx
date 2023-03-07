import { FC, useCallback, useMemo, useState } from "react";
import type { ISelectWithStoreProps, THandlerDisplayValues } from "./SelectWithStore.types";
import { compact, every, isArray, isFunction, isNull, isString, isUndefined, map } from "lodash";
import { observer } from "mobx-react";
import type { Model } from "@im/models";
import { EllipsisTooltip } from "../EllipsisTooltip";
import { useFeature } from "../../decorators/hooks/useFeature";
import { useStore } from "../../decorators/hooks/useStore";
import type { ISelectProps } from "../Select/Select.types";
import { Select } from "../Select/Select";
import { DropdownPlaceholder } from "../Select/DropdownPlaceholder/DropdownPlaceholder";
import { useMountEffect } from "../../decorators";
import { DropdownAnimationInterval } from "../../utils";

const optionFilterProp = "filterProp";

const mapModelToSelectOption = (model: Model, handlerDisplayValues?: THandlerDisplayValues) => {
  let label = model.getDisplayName();

  if (isFunction(handlerDisplayValues)) {
    const newLabel = handlerDisplayValues(model);
    if (isString(newLabel)) {
      label = newLabel;
    }
  }

  return {
    label: <EllipsisTooltip>{label}</EllipsisTooltip>,
    value: model.getInnerName(),
    [optionFilterProp]: model.getDisplayName(),
  };
};

const SelectWithStoreComponent: FC<ISelectWithStoreProps> = (props) => {
  const {
    store: storeProps,
    dataAccessKeys,
    value: valueProps,
    onChange,
    requestOnMount,
    queryVariables,
    clearDataOnClose,
    onFocus,
    onBlur,
    onDropdownVisibleChange,
    handlerDisplaySelectedValues,
    handlerDisplayValues,
    ...rest
  } = props;
  const { isFeatureEnabled } = useFeature();
  const [searchText, setSearchText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const isHasAccess =
    !!isFeatureEnabled && every(dataAccessKeys, (accessKey) => isFeatureEnabled(accessKey));

  const { store } = useStore(storeProps);

  useMountEffect(() => {
    if (requestOnMount) {
      fetchData();
    }
  });

  const model = store.model;

  const optionItems = useMemo(() => {
    if (model) {
      return map(model.getItems(), (item) => mapModelToSelectOption(item, handlerDisplayValues));
    } else {
      return [];
    }
  }, [model, handlerDisplayValues]);

  const modelsCollection = useMemo(
    () =>
      model?.getItems().reduce<TDictionary<Model>>((obj, item) => {
        obj[item.getInnerName()] = item;
        return obj;
      }, {}),
    [model]
  );

  const fetchData = useCallback(() => {
    store.requestData({ variables: queryVariables });
  }, [queryVariables, store]);

  const handleChange = useCallback<Required<ISelectProps>["onChange"]>(
    (_, options) => {
      const optionsArray = isArray(options) ? options : options ? [options] : [];

      if (onChange && modelsCollection) {
        onChange(compact(map(optionsArray, (item) => item.value && modelsCollection[item.value])));
      }
    },
    [modelsCollection, onChange]
  );

  const handleFocus = useCallback(() => {
    if (isFunction(onFocus)) {
      onFocus();
    }

    setIsFocused(true);
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    if (isFunction(onBlur)) {
      onBlur();
    }

    setIsFocused(false);
  }, [onBlur]);

  const handleVisibleChange = useCallback(
    (isOpened: boolean) => {
      if (isFunction(onDropdownVisibleChange)) {
        onDropdownVisibleChange();
      }
      if (isOpened && (isUndefined(store.data) || isNull(store.data))) {
        fetchData();
      }
      if (clearDataOnClose && !isOpened) {
        store.clearData();
      }
    },
    [clearDataOnClose, fetchData, onDropdownVisibleChange, store]
  );

  const value = useMemo(
    () => valueProps?.map((item) => mapModelToSelectOption(item, handlerDisplaySelectedValues)),
    [valueProps, handlerDisplaySelectedValues]
  );

  return (
    <Select
      {...rest}
      key="ant-select"
      open={store.data && isFocused ? undefined : false}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onDropdownVisibleChange={handleVisibleChange}
      onChange={handleChange}
      options={optionItems}
      value={value}
      onSearch={setSearchText}
      searchValue={searchText}
      optionFilterProp={optionFilterProp}
      notFoundContent={<DropdownPlaceholder hasAccess={isHasAccess} searchText={searchText} />}
    />
  );
};

SelectWithStoreComponent.defaultProps = {
  requestOnMount: true,
};

const SelectWithStore = observer(SelectWithStoreComponent);

export { SelectWithStore };

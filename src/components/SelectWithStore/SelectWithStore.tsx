import { type FC, type FocusEvent, useCallback, useMemo, useState } from "react";
import type { ISelectWithStoreProps, THandlerDisplayValues } from "./SelectWithStore.types";
import { compact, every, isArray, isFunction, isNull, isString, isUndefined, map } from "lodash";
import { observer } from "mobx-react";
import type { IModel, Model } from "@infomaximum/graphql-model";
import { useFeature } from "../../decorators/hooks/useFeature";
import { useStore } from "../../decorators/hooks/useStore";
import type { ISelectProps } from "../Select/Select.types";
import { Select } from "../Select/Select";
import { DropdownPlaceholder } from "../Select/DropdownPlaceholder/DropdownPlaceholder";
import { useMountEffect } from "../../decorators";
import { AlignedTooltip } from "../AlignedTooltip";

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
    label: label,
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
    requestOnMount = true,
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

  const handleFocus = useCallback(
    (e: FocusEvent<HTMLElement>) => {
      if (isFunction(onFocus)) {
        onFocus(e);
      }

      setIsFocused(true);
    },
    [onFocus]
  );

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLElement>) => {
      if (isFunction(onBlur)) {
        onBlur(e);
      }

      setIsFocused(false);
    },
    [onBlur]
  );

  const handleVisibleChange = useCallback(
    (isOpened: boolean) => {
      if (isFunction(onDropdownVisibleChange)) {
        onDropdownVisibleChange(isOpened);
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

  const renderOptions = (modelList: IModel[]): React.ReactNode[] => {
    return map(modelList, (model: IModel) => {
      let displayName: React.ReactNode = model?.getDisplayName();

      if (isFunction(handlerDisplayValues)) {
        displayName = handlerDisplayValues(model);
      }

      return (
        <Select.Option
          key={model.getInnerName()}
          value={model.getInnerName()}
          filterProp={displayName}
        >
          <AlignedTooltip>{displayName}</AlignedTooltip>
        </Select.Option>
      );
    });
  };

  return (
    <Select
      {...rest}
      key="ant-select"
      open={isFocused ? undefined : false}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onDropdownVisibleChange={handleVisibleChange}
      onChange={handleChange}
      value={value}
      onSearch={setSearchText}
      searchValue={searchText}
      optionFilterProp={optionFilterProp}
      notFoundContent={
        store.isDataLoaded ? (
          <DropdownPlaceholder hasAccess={isHasAccess} searchText={searchText} />
        ) : null
      }
    >
      {model ? renderOptions(model.getItems()) : []}
    </Select>
  );
};

const SelectWithStore = observer(SelectWithStoreComponent);

export { SelectWithStore };

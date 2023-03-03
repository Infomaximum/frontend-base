import { FC, useCallback, useMemo, useState } from "react";
import type { ISelectWithStoreProps } from "./SelectWithStore.types";
import { compact, every, isArray, map } from "lodash";
import { observer } from "mobx-react";
import type { Model } from "@im/models";
import { EllipsisTooltip } from "../EllipsisTooltip";
import { useFeature } from "../../decorators/hooks/useFeature";
import { useStore } from "../../decorators/hooks/useStore";
import { assertSimple } from "@im/asserts";
import type { ISelectProps } from "../Select/Select.types";
import { Select } from "../Select/Select";
import { DropdownPlaceholder } from "../Select/DropdownPlaceholder/DropdownPlaceholder";
import { useMountEffect } from "../../decorators";

const optionFilterProp = "filterProp";

const mapModelToSelectOption = (model: Model) => ({
  label: <EllipsisTooltip>{model.getDisplayName()}</EllipsisTooltip>,
  value: model.getInnerName(),
  [optionFilterProp]: model.getDisplayName(),
});

const SelectWithStoreComponent: FC<ISelectWithStoreProps> = (props) => {
  const {
    store: storeProps,
    dataAccessKeys,
    value: valueProps,
    onChange,
    requestOnMount,
    queryVariables,
    ...rest
  } = props;
  const { isFeatureEnabled } = useFeature();
  const [searchText, setSearchText] = useState("");

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
      return map(model.getItems(), (item) => mapModelToSelectOption(item));
    } else {
      return [];
    }
  }, [model]);

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

  const value = useMemo(
    () => valueProps?.map((item) => mapModelToSelectOption(item)),
    [valueProps]
  );

  return (
    <Select
      {...rest}
      key="ant-select"
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

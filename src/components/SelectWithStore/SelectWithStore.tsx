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
    ...rest
  } = props;
  const { isFeatureEnabled } = useFeature();
  const [searchText, setSearchText] = useState("");

  const isHasAccess =
    !!isFeatureEnabled &&
    every(dataAccessKeys, (accessKey) => isFeatureEnabled(accessKey));

  const { store } = useStore(storeProps, {
    requestOnMount: true,
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

  const handleChange = useCallback<Required<ISelectProps>["onChange"]>(
    (_, options) => {
      assertSimple(
        isArray(options),
        "В качестве value поддерживается только массив"
      );
      if (onChange && modelsCollection) {
        onChange(
          compact(
            map(options, (item) => item.value && modelsCollection[item.value])
          )
        );
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
      notFoundContent={
        <DropdownPlaceholder hasAccess={isHasAccess} searchText={searchText} />
      }
    />
  );
};

const SelectWithStore = observer(SelectWithStoreComponent);

export { SelectWithStore };

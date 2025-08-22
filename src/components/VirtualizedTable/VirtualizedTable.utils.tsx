import type { SpinProps, TableProps } from "antd";
import { isBoolean, forEach, isUndefined } from "lodash";
import hoistNonReactStatics from "hoist-non-react-statics";
import type { TPropInjector } from "@infomaximum/utility";
import { useDelayedTrue } from "@infomaximum/base/src/decorators/hooks/useDelayedTrue";
import type { TRow } from "@infomaximum/base/src/components/VirtualizedTable/VirtualizedTable.types";

export interface IWithSpinPropsReplacer extends Pick<TableProps<unknown>, "loading"> {}

type TDataSource = TableProps<TRow | null>["dataSource"];

/**
 * Адаптирует компонент, принимающий индикатор загрузки типа Boolean под прием SpinProps.
 * На текущий момент поддерживаются свойства spinning и delay из SpinProps.
 */
export const withSpinPropsReplacer: TPropInjector<
  { loading?: boolean | SpinProps },
  IWithSpinPropsReplacer
> = (Component) => {
  const SpinPropsReplacer = ({ loading, ...restProps }: any) => {
    const { spinning = Boolean(loading), delay = 0 } = isBoolean(loading) ? {} : loading;

    const delayedLoading = useDelayedTrue(spinning, delay);

    return <Component {...restProps} loading={delayedLoading} />;
  };

  return hoistNonReactStatics(SpinPropsReplacer, Component);
};

export function getMultipleRowSelectionHelpers(
  lastSelectedRowIndex: number | null,
  setLastSelectedRowIndex: (index: number | null) => void
) {
  const handleMultipleSelect = (
    currentSelectedRowIndex: number,
    dataSource: TDataSource,
    selectedRowKeysSet: Set<string> | null
  ) => {
    const configLastSelectedRowIndex = lastSelectedRowIndex ?? currentSelectedRowIndex;

    const startIndex = Math.min(configLastSelectedRowIndex || 0, currentSelectedRowIndex);
    const endIndex = Math.max(configLastSelectedRowIndex || 0, currentSelectedRowIndex);

    const rangeKeys = dataSource?.slice(startIndex, endIndex + 1).map((row) => row?.key);
    const changedKeys: string[] = [];

    const shouldSelected = rangeKeys?.some((rowKey) =>
      !isUndefined(rowKey) ? !selectedRowKeysSet?.has(rowKey) : false
    );

    forEach(rangeKeys, (key) => {
      if (key) {
        if (shouldSelected) {
          if (!selectedRowKeysSet?.has(key)) {
            changedKeys.push(key);
          }

          selectedRowKeysSet?.add(key);
        } else {
          selectedRowKeysSet?.delete(key);
          changedKeys.push(key);
        }
      }
    });

    setLastSelectedRowIndex(shouldSelected ? currentSelectedRowIndex : null);

    return changedKeys;
  };

  const updateLastSelectedIndex = (index: number | null) => {
    setLastSelectedRowIndex(index);
  };

  return { handleMultipleSelect, updateLastSelectedIndex };
}

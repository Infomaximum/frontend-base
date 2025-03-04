import { Group, type IGroup, type IModel } from "@infomaximum/graphql-model";
import { forEach, map } from "lodash";
import type { TBaseRow } from "../../managers/Tree";
import { RestModel } from "../../models/RestModel";
import { ShowMore } from "../ShowMore/ShowMore";
import type { IShowMoreOwnProps } from "../ShowMore/ShowMore.types";
import type { IColumnProps } from "../VirtualizedTable/VirtualizedTable.types";
import type { ITableTopButtonDisabledProps } from "./DataTable.types";
import { leftMouseBtnCode } from "../../utils";

function getTableTopButtonDisabledStatus(disabledProps: ITableTopButtonDisabledProps) {
  const {
    treeCounter,
    empty = false,
    singleGroup = false,
    shallowSingleGroup = false,
    onlyGroup = false,
    singleItem = false,
    onlyItem = false,
    singleAnything = false,
    shallowSingleAnything = false,
    anything = false,
    full = false,
  } = disabledProps;

  if (treeCounter === null) {
    return false;
  }

  const {
    totalCheckedCount,
    groupsCheckedCount,
    itemsCheckedCount,
    groupsCheckedShallowCount,
    itemsCheckedShallowCount,
    targetAll,
  } = treeCounter;

  return !(
    (empty && totalCheckedCount === 0) ||
    (singleGroup && groupsCheckedCount === 1 && itemsCheckedShallowCount === 0) ||
    (shallowSingleGroup && groupsCheckedShallowCount === 1 && itemsCheckedShallowCount === 0) ||
    (onlyGroup && groupsCheckedShallowCount > 1 && itemsCheckedShallowCount === 0) ||
    (singleItem && groupsCheckedCount === 0 && itemsCheckedCount === 1) ||
    (onlyItem && groupsCheckedCount === 0 && itemsCheckedCount > 1) ||
    (singleAnything && totalCheckedCount === 1) ||
    (shallowSingleAnything && groupsCheckedShallowCount + itemsCheckedShallowCount === 1) ||
    (anything && totalCheckedCount > 0) ||
    (full && targetAll)
  );
}

/**
 * Возвращает id выбранных моделей, отсортированных по тому, является ли модель группой.
 * @param checkedModels модели элементов, выбранных через чекбоксы
 * @param primeModel модель, имеющая приоритет над checkedModels (выбранная через контекстное меню)
 */
function getSelectedEntitiesIds(
  checkedModels?: (IModel | IGroup | RestModel)[],
  primeModel?: IModel | IGroup
): [number[], number[]] {
  const itemsIds: number[] = [];
  const groupsIds: number[] = [];

  if (primeModel || checkedModels) {
    const selectedModels = primeModel ? [primeModel] : checkedModels;

    forEach(selectedModels, (model) => {
      if (model instanceof RestModel) {
        return;
      }

      const id = model.getId();

      if (model instanceof Group) {
        groupsIds.push(id);
      } else {
        itemsIds.push(id);
      }
    });
  }

  return [itemsIds, groupsIds];
}

const onCellDefault = () => {
  return {
    onClick(event: React.MouseEvent<HTMLDivElement>) {
      if (window.getSelection()?.toString()) {
        event.stopPropagation();

        return;
      }
    },
    onMouseDown(e: React.MouseEvent) {
      if (e.button === leftMouseBtnCode) {
        window.getSelection()?.removeAllRanges();
      }
    },
  };
};

const getColumnsWithShowMore = <T extends TBaseRow>(
  columns: IColumnProps<T>[] | undefined,
  props: Omit<IShowMoreOwnProps, "model">
) =>
  map(columns, ({ render, ...rest }: IColumnProps<T>, index: number) => ({
    ...rest,
    filterDropdownProps: rest?.filterDropdownProps as any,
    render(text: string, record: T, rowIndex: number) {
      const { model } = record;

      if (model instanceof RestModel) {
        return index === 0 ? (
          <ShowMore key={`show-more-${model.getInnerName()}`} model={model} {...props} />
        ) : null;
      }

      if (render) {
        return render(text, record, rowIndex);
      }

      return text;
    },
    // объединяет пустые колонки в строке ShowMore AntTable для центрирования при подгрузке по скроллу
    onCell:
      props.mode === "scrolling"
        ? (record: T) => {
            if (record?.model instanceof RestModel && index === 0) {
              return { colSpan: columns?.length };
            }

            return onCellDefault();
          }
        : rest?.onCell || onCellDefault,
  }));

export { getTableTopButtonDisabledStatus, getSelectedEntitiesIds, getColumnsWithShowMore };

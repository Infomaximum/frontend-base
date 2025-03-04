import type { IModel } from "@infomaximum/graphql-model";
import type { TBaseRow } from "../../../../managers/Tree";
import type { IDataTableOwnProps } from "../../../DataTable/DataTable.types";

export interface IDataTableDrawerContentProps<T extends TBaseRow = TBaseRow>
  extends Pick<
      IDataTableOwnProps<T>,
      | "headerMode"
      | "showHeader"
      | "selectionType"
      | "rowDisable"
      | "tableStore"
      | "invisibleRowKeys"
      | "queryVariables"
      | "isGroupSelection"
      | "requestOnMount"
      | "columns"
      | "tableStore"
      | "defaultCheckedModels"
      | "isVirtualized"
      | "onChange"
      | "rowSelection"
    >,
    Pick<Partial<IDataTableOwnProps<T>>, "rowBuilder"> {
  // todo: Зачем нужен этот проп, если есть возможность передать rowBuilder?
  handlerTableDisplayValues?(value: IModel): string | undefined;

  treeCheckedStateCleanSetter?: (treeCheckedStateCleaner: () => void) => void;

  // Принудительно включить (когда модель не наследник PagingGroup) или принудительно выключить (когда нет поддержки сервера или фронта)
  isLoadingOnScroll?: boolean;
}

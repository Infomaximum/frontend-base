import type { TAccessRules } from "../../utils/access";
import type { ReactNode } from "react";

export type TContextMenuItem = {
  action: string;
  label: string | ReactNode;
  disabled?: boolean;
  /**
   * Тип операции, который необходим для отображения данного пункта контекстного меню. Ключи привилегий берутся из
   * таблицы. Если тип операции не передан, то проверка производится не будет.
   */
  accessRules?: TAccessRules | TAccessRules[];
  "test-id"?: string;
  priority?: number;
  /** Иконка, которая будет отображена вместо контекстного меню, если в контекстном меню останется только один пункт */
  icon?: JSX.Element;
};

export interface IContextMenuTableProps {
  items: TContextMenuItem[];
  data: TDictionary;
  onSelect(action: string, data: any): void;
}

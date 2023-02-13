import type {
  IDataTableOwnProps,
  IDataTableProps,
} from "../DataTable/DataTable.types";
import type { TAccess } from "@im/utils";
import type { MutableRefObject } from "react";
import type { EditableDataTableKeys } from "./EditableDataTable";
import type { EAddingRowMethod, TBaseRow } from "../../managers/Tree";
import type { IFormWrapperProps } from "../forms/Form/FormWrapper.types";
import type { IWithModalErrorProps } from "../../decorators/hocs/withModalError/withModalError.types";
import type { IWithLocProps } from "../../decorators/hocs/withLoc/withLoc";
import type { IWithFeatureProps } from "../../decorators/hocs/withFeature/withFeature.types";

export interface IEditableRow extends TBaseRow {
  [EditableDataTableKeys.isRowEditDenied]?: boolean;
  [EditableDataTableKeys.isRowRemoveDenied]?: boolean;
}

export interface IEditableDataTableProvider {
  /**
   * Функция для кастомного добавления новой строки в редактируемую таблицу
   */
  handleAddRow(): void;
}

export interface IEditableDataTableOwnProps<T>
  extends Omit<IDataTableOwnProps<T>, "addRows"> {
  /**
   * Ключ, задающий уникальность таблице, чтобы не возникало конфликтов в именах форм.
   */
  tableKey: string;
  /**
   * Обработчик сохранения строки редактирования (если у строки в record есть поле model)
   */
  onSubmitEditingRow(record: T): Promise<any>;

  /**
   * Обработчик сохранения строки добавления сущности (если у строки в record нет поля model)
   */
  onSubmitAddedRow(record: T): Promise<any>;

  /**
   * Обработчик удаления строки добавления сущности
   */
  onRemoveRow?(record: T): Promise<any>;

  /**
   * Привилегии доступа
   */
  accessKeys?: string[];
  someAccessKeys?: string[];
  /*
   * Если недостаточно проверок на accessKeys и someAccessKeys, то можно указать доступ явно
   */
  customAccess?: TAccess;

  /**
   * Функция, возвращающая данные для строки добавления
   */
  addedRowBuilder?(key: string): T;

  /**
   * ref, с помощью которого можно передать данные из EditableTable для кастомизации,
   * если это потребуется в будущем
   */
  providerRef?: MutableRefObject<any>;

  tableComponents?: IDataTableProps<T>["components"];

  /**
   * Функция, прокидывающая состояние редактирования строки
   */
  setEditingRowKeyCallback?: (isEditingRowKey: boolean) => void;

  /**
   * Флаг для внешнего управления submit
   */
  isSubmitting?: boolean;

  /**
   * Производится ли в данный момент сортировка
   */
  isSorting?: boolean;

  /**
   * Функция, которая предоставляет доступ к объекту c методами формы активной строки
   */
  setActiveFormData?: IFormWrapperProps["setFormData"];

  /**
   * Callback, который отработает, если было отменено редактирование или добавление
   */
  onResetRow?(addedRow: T | undefined, editingRowKey: string | undefined): void;

  /**
   * Метод добавления новой строки в таблицу
   * @see подробнее => {@link EAddingRowMethod }
   * */
  addingRowMethod?: EAddingRowMethod;
}

export interface IEditableDataTableProps<T>
  extends IEditableDataTableOwnProps<T>,
    IWithModalErrorProps,
    IWithLocProps,
    IWithFeatureProps {}

export interface IEditableDataTableState<T> {
  /** Начальные данные для добавленной строки*/
  addedRow?: T;

  editingRowKey?: string;

  isSubmitting?: boolean;

  removingRowKey?: string;

  access?: TAccess;

  /**
   * Метод добавления новой строки в таблицу
   * @see подробнее => {@link EAddingRowMethod }
   * */
  addingRowMethod?: EAddingRowMethod;
}

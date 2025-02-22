import type { FieldArrayProps, FieldArrayRenderProps } from "react-final-form-arrays";
import type { FormItemProps } from "antd/lib/form/FormItem";
import type { EAddEntityButtonPositions } from "./ArrayField";
import type { TFeatureEnabledChecker } from "@infomaximum/utility";
import type { Interpolation } from "@emotion/react";
import type { IFormProvider } from "../../../decorators/contexts/FormContext";
import type { IWithFeatureProps } from "../../../decorators/hocs/withFeature/withFeature.types";

export interface IFieldEntityComponentProps {
  onRemoveFieldEntity: (index: number) => void;
  fieldEntityPath: string;
  fieldEntityIndex: number;
  removeIcon?: JSX.Element;
  customRemoveIconStyle?: Interpolation<TTheme>;
  readOnly?: boolean;
  isRemoveItem?: boolean;
  writeAccess?: boolean;
  removeAccess?: boolean;
  createAccess?: boolean;
  autoFocus?: boolean;
  id?: string;
}

export interface IArrayFieldProvider {
  /**
   * Удалить элемент arrayField по указанному индексу
   */
  removeFieldEntity?: (index: number) => void;
  /**
   * Добавить пустой элемент arrayField
   */
  addFieldEntity?: () => void;
  /**
   * Удалить несколько элементов arrayField по указанным индексам
   */
  batchRemoveFieldEntities?: (indexes: number[]) => void;
}

export interface ICommonArrayFieldProps {
  /**
   * Надпись в ссылке для добавление нового поля
   */
  addButtonDescription?: string | React.ReactElement;

  /**
   * Позиционирование кнопки добавление сущности
   */
  addEntityButtonPosition?: EAddEntityButtonPositions;
  /**
   * Компонент который будет являться элементом массива полей
   */
  fieldEntityComponent: React.ComponentType<IFieldEntityComponentProps>;

  /**
   * Пропсы которые будут переданы в айтемы ArrayField
   */
  fieldEntityComponentProps?: Record<string, any>;
  /**
   * Функция, которая даёт доступ к набору управляющих обработчиков FieldArray (удаление, добавление элемента)
   */
  setArrayFieldProvider?: (provider: IArrayFieldProvider) => void;
  /**
   * значение по умолчанию при добавлении нового поля
   */
  defaultEntityValue?: any;
  /**
   * режим только для чтения
   */
  readOnly?: boolean;
  /**
   * привилегия доступа
   */
  accessKey?: string;
  /**
   * test-id
   */
  "test-id"?: string;
  /**
   * имя поля
   */
  arrayFieldName?: string;
  /**
   * Приоритет
   */
  priority?: number;
  /**
   * Флаг, указываюший на autoFocus находящегося внутри input'a при добавлении новых элементов
   */
  autoFocus?: boolean;
}

export interface IWrappedArrayFieldProps<FV = any, T extends HTMLElement = HTMLElement>
  extends FieldArrayRenderProps<FV, T>,
    FormItemProps,
    ICommonArrayFieldProps {
  accessKey?: string;
  isFeatureEnabled?: TFeatureEnabledChecker;
  formProvider: IFormProvider;
  spaceSize: string;
  formItemStyle?: Interpolation<TTheme>;
  additionalButtonContent?: (formProvider: IFormProvider) => React.ReactElement;
}

export interface IWrappedArrayFieldState {}

export interface IArrayFieldProps<FV = any, T extends HTMLElement = HTMLElement>
  extends Partial<FormItemProps>,
    ICommonArrayFieldProps,
    IWithFeatureProps {
  name: string;
  accessKeys?: string[];
  accessKey?: string;
  formItemStyle?: Interpolation<TTheme>;
  children?: React.ReactNode;
  additionalButtonContent?: (formProvider: IFormProvider) => React.ReactElement;
  isEqual?: FieldArrayProps<FV, T>["isEqual"];
}

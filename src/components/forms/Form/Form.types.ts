import type { ElementType } from "react";
import type { Interpolation } from "@emotion/react";
import type { IBaseFormProps } from "../BaseForm/BaseForm.types";
import type { TAccess, TFeatureEnabledChecker } from "@infomaximum/utility";
import type { FormRenderProps } from "react-final-form";
import type {
  IFormContextData,
  IFormData,
  IFormProvider,
} from "../../../decorators/contexts/FormContext";
import type { IWithFormSubmitPromiseProps } from "../../../decorators/hocs/withFormSubmitPromise/withFormSubmitPromise.types";
import type { IWithFeatureProps } from "../../../decorators/hocs/withFeature/withFeature.types";

/**
 * Интерфейс для описание пропсов которые можно передавать извне
 */
export interface IFormOwnProps<T extends IBaseFormProps = IBaseFormProps> extends IBaseFormProps {
  "test-id"?: string;
  blockUri?: string;
  onKeyDown?: (event: KeyboardEvent, formProvider?: IFormProvider) => void;
  errorNotification?: string;
  onSubmitSuccessed?(formProvider?: IFormProvider): void;
  connectedFormWrapperStyle?: Interpolation<TTheme>;

  /**
   * По умолчанию используется `BaseForm`
   */
  component?: ElementType<T>;

  /**
   * Ключи привилегий, наличие которых необходимо для отображения полей формы. Если ключи не указаны, то проверка и
   * модификация не производится. Поля формы будет отображаться в разных состояниях, как то полный доступ или режим
   * только для чтения, либо будут полностью скрываться, если не будет доступно ни одной операции по указанным
   * привилегиям. Имеет более низкий приоритет, чем ключи привилегий от полей формы.
   *
   * Ключи связанные между собой логической операцией "И"
   */
  accessKeys?: string[];

  /**
   * Ключи связанные между собой логической операцией "ИЛИ"
   */
  someAccessKeys?: string[];

  /*
   * Если недостаточно проверок на accessKeys и someAccessKeys, то можно указать доступ явно
   */
  customAccess?: TAccess;

  notification?:
    | React.ReactNode
    | (() => React.ReactNode)
    | [(formValues?: TDictionary, props?: any) => React.ReactNode | React.ReactNode[]];

  /**
   * Флаг указывающий на то, нужно ли сортировать элементы формы по приоритету
   * (у дочерних компонентов должно быть задано свойство priority, если свойство не задано,
   * то, по умолчанию, будет использоваться значение приоритета, равное 0)
   */
  sortByPriority?: boolean;

  /**
   * Имя формы (нужно для формирования "test-id" у элементов формы и правильной работы Prompt)
   */
  formName: string;

  /**
   * Функция, которая предоставляет доступ к объекту c методами формы
   */
  setFormData?: (formData?: IFormData<any>) => void;
}

/**
 * Интерфейс для описания внутренних пропсов компонента
 */
export interface IFormProps
  extends IFormOwnProps,
    Omit<FormRenderProps, "error" | "submitError" | "component" | "active">,
    IWithFormSubmitPromiseProps {
  children: React.ReactNode;
  isFeatureEnabled: IWithFeatureProps["isFeatureEnabled"];
}

export interface IFormState {
  contextData: IFormContextData;
  accessKeys?: string[];
  someAccessKeys?: string[];
  customAccess?: TAccess;
  isFeatureEnabled?: TFeatureEnabledChecker;
}

export interface IContainerFormStatic<T> {
  FormName: string;
  FormFieldNames: T;
}

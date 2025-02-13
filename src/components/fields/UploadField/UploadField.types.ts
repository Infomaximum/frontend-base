import type { UploadProps } from "antd/lib/upload/Upload";
import type { UploadChangeParam } from "antd/lib/upload";
import type { Interpolation } from "@emotion/react";
import type { IFieldProps } from "../FormField/Field/Field.types";
import type { IFormFieldProps } from "../FormField/FormField.types";
import type { FieldRenderProps } from "react-final-form";
import type { UploadFormField } from "./UploadField";

export type TUploadFieldValue = UploadChangeParam["file"][];

export interface IUploadComponentProps extends IUploadComponentOwnProps, FieldRenderProps<any> {}
export interface IUploadComponentOwnProps extends Omit<UploadProps, "onChange"> {
  name: string;
  onChange?: (value?: TUploadFieldValue) => void;
  value?: UploadChangeParam["file"];
  caption?: React.ReactNode;
  fileList: TUploadFieldValue;
  disableAnimation?: boolean;
  /**
   *
   * @deprecated - Теперь файлы передаются в onSubmit
   */
  chooseFile?: (value?: UploadChangeParam["file"]) => UploadChangeParam["file"];
  /** Функция для учета выбранных файлов, передавать с пропсом multiList={true} */
  /**
   *
   * @deprecated - Теперь файлы передаются в onSubmit
   */
  chooseFiles?: (values?: TUploadFieldValue) => TUploadFieldValue;
  removeFile?: (fileUid: string) => void;
  fieldStyle?: Interpolation<TTheme>;
  /** лист загруженных файлов может содержать >1 элемента */
  multiList?: boolean;
  readOnly?: boolean;
  maxFileSize?: number;
  mode?: keyof typeof UploadFormField.AVAILABLE_MODE_LIST;
  fileFormatPlaceholder?: string;
}

export interface IUploadProps
  extends Omit<IFieldProps<TUploadFieldValue>, "component" | "onChange">,
    IUploadComponentOwnProps {
  disableAnimation?: boolean;
  name: string;
}

export interface IUploadFormFieldProps
  extends Omit<IFormFieldProps<TUploadFieldValue>, "component" | "onChange"> {
  disableAnimation?: boolean;
}

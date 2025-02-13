import React, { createRef, type HTMLAttributes, type FC } from "react";
import { Upload } from "antd";
import { isFunction, isEqual, forEach, isEmpty, isString, get } from "lodash";
import { useLocalization } from "../../../decorators/hooks/useLocalization";
import { FormContext } from "../../../decorators/contexts/FormContext";
import { removeUploadFieldButtonTestId } from "../../../utils";
import {
  CLICK_OR_DROP_A_FILE_HERE,
  DELETE,
  FILE_FORMAT,
  MAX_SIZE_OF_THE_FILE,
  UPLOAD_THE_FILE_IN_THE_FORMAT,
} from "../../../utils/Localization/Localization";
import {
  draggerStyle,
  uploadListItemStyle,
  uploadIconStyle,
  uploadWrapperStyle,
} from "./UploadField.styles";
import { DeleteOutlined } from "../../Icons";
import { InboxOutlinedSVG } from "../../../resources/icons";
import { Message } from "../../Message/Message";
import { Tooltip } from "../../Tooltip/Tooltip";
import { Field, FormField } from "../FormField";
import type { RcFile, UploadChangeParam } from "antd/lib/upload";
import type {
  IUploadComponentProps,
  IUploadProps,
  IUploadFormFieldProps,
  TUploadFieldValue,
} from "./UploadField.types";
import type { ShowUploadListInterface } from "antd/es/upload/interface";

const fakeFileType = "fake-file" as const;
const fileStatusRemoved = "removed";

const removeElementsAttribute = (
  targetNode: HTMLDivElement,
  selectorList = ["span.ant-upload-list-item-name", "span.ant-upload-list-item-actions button"],
  removableAttribute: keyof HTMLAttributes<HTMLElement> = "title"
) => {
  const elementList: Element[] = [];

  forEach(selectorList, (selector) => {
    const descendantElementList = targetNode.querySelectorAll(selector);

    if (!isEmpty(descendantElementList)) {
      elementList.push(...Array.from(descendantElementList));
    }
  });

  forEach(elementList, (element) => {
    if (element.hasAttribute(removableAttribute)) {
      element.removeAttribute(removableAttribute);
    }
  });
};

const validateFileSize = (file: RcFile, maxSize: number) => file?.size / 1024 / 1024 < maxSize;

const { Dragger } = Upload;

class UploadComponent extends React.PureComponent<IUploadComponentProps> {
  public static readonly AVAILABLE_MODE_LIST = {
    USUAL: "USUAL",
    DRAG_AND_DROP: "DRAG_AND_DROP",
  } as const;

  private wrapperRef = createRef<HTMLDivElement>();
  private mutationObserver: MutationObserver | undefined;

  public override componentDidMount() {
    const targetNode = this.wrapperRef.current;

    if (targetNode) {
      removeElementsAttribute(targetNode);

      this.mutationObserver = new MutationObserver(() => {
        removeElementsAttribute(targetNode);

        const submitErrorTooltips = targetNode.querySelectorAll(
          "div.ant-upload-list-text-container div.ant-upload-list-item-error + div div.ant-tooltip"
        );

        forEach(submitErrorTooltips, (tooltip) => {
          const parentElement = tooltip.parentElement;

          if (parentElement) {
            parentElement.removeChild(tooltip);
          }
        });
      });

      this.mutationObserver.observe(targetNode, {
        childList: true,
        subtree: true,
      });
    }
  }

  public override componentDidUpdate(prevProps: IUploadComponentProps) {
    /** нужно для подмены настоящих файлов на фейковые, которые пришли в defaultFileList и
     *  корректного последующего учета удаленных файлов
     *  (uid_фейкового_файла=id_настоящего_файла_на_сервере)
     */
    if (
      this.props.defaultFileList &&
      !isEqual(prevProps.defaultFileList, this.props.defaultFileList)
    ) {
      this.handleInputChange(this.props.defaultFileList);
    }
  }

  public override componentWillUnmount() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }

  private getDefaultUploadListConfig(
    showUploadList: boolean | ShowUploadListInterface<any> | undefined,
    isShowTooltip: boolean = false
  ): ShowUploadListInterface | false {
    if (
      typeof showUploadList === "undefined" ||
      (typeof showUploadList === "boolean" && showUploadList)
    ) {
      return {
        showRemoveIcon: true,
        removeIcon: isShowTooltip ? (
          <Tooltip
            align={{ targetOffset: [0, 0] }}
            title={this.props.localization.getLocalized(DELETE)}
            placement={"top"}
          >
            <DeleteOutlined test-id={removeUploadFieldButtonTestId} />
          </Tooltip>
        ) : (
          <DeleteOutlined test-id={removeUploadFieldButtonTestId} />
        ),
      };
    }

    if (!showUploadList) {
      return false;
    } else {
      return showUploadList;
    }
  }

  private handleInputChange(fileListProps: TUploadFieldValue) {
    const { chooseFile, chooseFiles, multiList, input, maxFileSize } = this.props;

    const fileList = maxFileSize
      ? fileListProps.filter((file: RcFile) => validateFileSize(file, maxFileSize))
      : fileListProps;

    if (multiList) {
      if (isFunction(chooseFiles)) {
        chooseFiles(fileList);
      }
    } else {
      if (isFunction(chooseFile)) {
        chooseFile(fileList?.[0] ?? undefined);
      }
    }

    input.onChange(fileList);
  }

  private handleRemove = (file: UploadChangeParam["file"]) => {
    const { removeFile } = this.props;

    if (isFunction(removeFile)) {
      // если файл "не настоящий"
      if (file.type === fakeFileType) {
        removeFile(file.uid);
      }
    }

    if (this.props.multiList) {
      const fileList = this.props.input.value.filter(
        (fileFromInput: UploadChangeParam["file"]) => fileFromInput.uid !== file.uid
      );
      this.handleInputChange(fileList);
    } else {
      this.handleInputChange([]);
    }
  };

  private handleChange = (info: UploadChangeParam) => {
    if (!isEqual(info.file?.status, fileStatusRemoved)) {
      this.handleInputChange(this.props.multiList ? info.fileList : [info.file]);
    } else {
      const newFileList = info.fileList.filter(
        (fileFromList) => fileFromList.uid !== info.file.uid
      );
      this.handleInputChange(newFileList);
    }
  };

  public beforeUpload = (file: RcFile) => {
    const { localization, maxFileSize } = this.props;

    if (maxFileSize && !validateFileSize(file, maxFileSize)) {
      Message.showMessage({
        notification: localization.getLocalized(MAX_SIZE_OF_THE_FILE(maxFileSize)),
        type: "error",
      });
    }

    return false;
  };

  private handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const { localization, accept } = this.props;

    // Для невалидных файлов ant не генерирует uid
    if (!isString(get(e.dataTransfer, "files[0].uid")) && accept) {
      Message.showMessage({
        notification: localization.getLocalized(UPLOAD_THE_FILE_IN_THE_FORMAT(accept)),
        type: "error",
      });
    }
  };

  private getUpload(): React.ReactNode {
    const { caption, fieldStyle, multiList, input, showUploadList, ...rest } = this.props;

    return (
      <Upload
        {...rest}
        showUploadList={this.getDefaultUploadListConfig(showUploadList, true)}
        maxCount={!multiList ? 1 : undefined}
        fileList={input.value || this.props.defaultFileList || []}
        onChange={this.handleChange}
        onRemove={this.handleRemove}
        beforeUpload={this.beforeUpload}
        css={[fieldStyle, uploadListItemStyle]}
      >
        {caption}
      </Upload>
    );
  }

  private renderUsualMode(): React.ReactNode {
    const { disableAnimation, input, defaultFileList } = this.props;

    if (disableAnimation && (input.value.length || defaultFileList)) {
      return <div css={uploadWrapperStyle}>{this.getUpload()}</div>;
    }

    return this.getUpload();
  }

  private renderDragAndDropMode(): React.ReactNode {
    const {
      caption,
      fieldStyle,
      readOnly,
      meta,
      multiList,
      input,
      accept,
      localization,
      fileFormatPlaceholder,
      maxFileSize,
      showUploadList,
      ...rest
    } = this.props;

    // TODO: Написать свой плейсхолдер
    return (
      <Dragger
        {...rest}
        maxCount={!multiList ? 1 : undefined}
        fileList={input.value || this.props.defaultFileList || []}
        showUploadList={this.getDefaultUploadListConfig(showUploadList)}
        onChange={this.handleChange}
        onRemove={this.handleRemove}
        beforeUpload={this.beforeUpload}
        accept={accept}
        css={[fieldStyle, draggerStyle, uploadListItemStyle]}
        onDrop={this.handleDrop}
      >
        <p style={uploadIconStyle}>
          <InboxOutlinedSVG />
        </p>
        <p className="ant-upload-text">{localization.getLocalized(CLICK_OR_DROP_A_FILE_HERE)}</p>
        {!accept ? null : (
          <p className="ant-upload-hint">
            {localization.getLocalized(FILE_FORMAT, {
              templateData: {
                fileFormat:
                  fileFormatPlaceholder ?? accept.substring(1, accept.length).toUpperCase(),
              },
            })}
          </p>
        )}
        {!maxFileSize ? null : (
          <p className="ant-upload-hint">
            {localization.getLocalized(MAX_SIZE_OF_THE_FILE(maxFileSize))}
          </p>
        )}
      </Dragger>
    );
  }

  public override render() {
    const { mode } = this.props;
    const isUsual = mode === UploadComponent.AVAILABLE_MODE_LIST.USUAL;
    const resultComponent = isUsual ? this.renderUsualMode() : this.renderDragAndDropMode();

    return <div ref={this.wrapperRef}>{resultComponent}</div>;
  }
}

const UploadField: React.FC<IUploadProps> = ({
  readOnly,
  mode = UploadComponent.AVAILABLE_MODE_LIST.USUAL,
  ...rest
}) => {
  return (
    <FormContext.Consumer>
      {(formData) => {
        if ((readOnly === undefined && !formData.access.hasWriteAccess) || readOnly) {
          return null;
        }

        return <Field component={UploadComponent} mode={mode} {...rest} />;
      }}
    </FormContext.Consumer>
  );
};

const UploadFormField: FC<IUploadFormFieldProps> & {
  AVAILABLE_MODE_LIST: typeof UploadComponent.AVAILABLE_MODE_LIST;
} = (props) => {
  const localization = useLocalization();

  return <FormField component={UploadField} localization={localization} {...props} />;
};

UploadFormField.AVAILABLE_MODE_LIST = UploadComponent.AVAILABLE_MODE_LIST;

export { UploadFormField, fakeFileType };

import React, { createRef, HTMLAttributes, FC } from "react";
import { Upload } from "antd";
import type { UploadChangeParam } from "antd/lib/upload";
import type {
  IUploadComponentProps,
  IUploadProps,
  IUploadFormFieldProps,
  TUploadFieldValue,
} from "./UploadField.types";
import { isFunction, isEqual, forEach, isEmpty, isString, get } from "lodash";
import {
  CLICK_OR_DRAG_FILE,
  FILE_FORMAT,
  UPLOAD_THE_FILE_IN_THE_FORMAT,
} from "../../../utils/Localization/Localization";
import { draggerStyle, uploadIconStyle } from "./UploadField.styles";
import { Message } from "../../Message/Message";
import { InboxOutlinedSVG } from "../../../resources/icons";
import { FormContext } from "../../../decorators/contexts/FormContext";
import { Field, FormField } from "../FormField";
import { useLocalization } from "../../../decorators/hooks/useLocalization";

const fakeFileType = "fake-file" as const;
const fileStatusRemoved = "removed";

const removeElementsAttribute = (
  targetNode: HTMLDivElement,
  selectorList = [
    "span.ant-upload-list-item-name",
    "span.ant-upload-list-item-card-actions button",
  ],
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

  private handleInputChange(fileList: TUploadFieldValue) {
    const { chooseFile, chooseFiles, multiList, input } = this.props;

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
        (fileFromInput: UploadChangeParam["file"]) =>
          fileFromInput.uid !== file.uid
      );
      this.handleInputChange(fileList);
    } else {
      this.handleInputChange([]);
    }
  };

  private handleChange = (info: UploadChangeParam) => {
    if (!isEqual(info.file?.status, fileStatusRemoved)) {
      this.handleInputChange(
        this.props.multiList ? info.fileList : [info.file]
      );
    } else {
      const newFileList = info.fileList.filter(
        (fileFromList) => fileFromList.uid !== info.file.uid
      );
      this.handleInputChange(newFileList);
    }
  };

  public beforeUpload = () => {
    return false;
  };

  private handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const { localization, accept } = this.props;
    // Для невалидных файлов ant не генерирует uid
    if (!isString(get(e.dataTransfer, "files[0].uid")) && accept) {
      Message.showMessage({
        notification: localization.getLocalized(
          UPLOAD_THE_FILE_IN_THE_FORMAT(accept)
        ),
        type: "error",
      });
    }
  };

  private renderUsualMode(): React.ReactNode {
    const { caption, fieldStyle, readOnly, meta, multiList, input, ...rest } =
      this.props;

    return (
      <Upload
        {...rest}
        maxCount={!multiList ? 1 : undefined}
        fileList={input.value || this.props.defaultFileList || []}
        onChange={this.handleChange}
        onRemove={this.handleRemove}
        beforeUpload={this.beforeUpload}
        css={fieldStyle}
      >
        {caption}
      </Upload>
    );
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
      ...rest
    } = this.props;

    //TODO: Антон Тамбовцев. Написать свой плейсхолдер
    return (
      <Dragger
        {...rest}
        maxCount={!multiList ? 1 : undefined}
        fileList={input.value || this.props.defaultFileList || []}
        onChange={this.handleChange}
        onRemove={this.handleRemove}
        beforeUpload={this.beforeUpload}
        accept={accept}
        css={[fieldStyle, draggerStyle]}
        onDrop={this.handleDrop}
      >
        <p style={uploadIconStyle}>
          <InboxOutlinedSVG />
        </p>
        <p className="ant-upload-text">
          {localization.getLocalized(CLICK_OR_DRAG_FILE)}
        </p>
        {!accept ? null : (
          <p className="ant-upload-hint">
            {localization.getLocalized(FILE_FORMAT, {
              templateData: {
                fileFormat: accept.substring(1, accept.length).toUpperCase(),
              },
            })}
          </p>
        )}
      </Dragger>
    );
  }

  public override render() {
    const { mode } = this.props;
    const isUsual = mode === UploadComponent.AVAILABLE_MODE_LIST.USUAL;
    const resultComponent = isUsual
      ? this.renderUsualMode()
      : this.renderDragAndDropMode();

    return <div ref={this.wrapperRef}>{resultComponent}</div>;
  }
}

const UploadField: React.FC<IUploadProps> = ({ readOnly, ...rest }) => {
  return (
    <FormContext.Consumer>
      {(formData) => {
        if (
          (readOnly === undefined && !formData.access.hasWriteAccess) ||
          readOnly
        ) {
          return null;
        }

        return <Field component={UploadComponent} {...rest} />;
      }}
    </FormContext.Consumer>
  );
};

UploadField.defaultProps = {
  mode: UploadComponent.AVAILABLE_MODE_LIST.USUAL,
};

const UploadFormField: FC<IUploadFormFieldProps> & {
  AVAILABLE_MODE_LIST: typeof UploadComponent.AVAILABLE_MODE_LIST;
} = (props) => {
  const localization = useLocalization();

  return (
    <FormField component={UploadField} localization={localization} {...props} />
  );
};

UploadFormField.AVAILABLE_MODE_LIST = UploadComponent.AVAILABLE_MODE_LIST;

export { UploadFormField, fakeFileType };

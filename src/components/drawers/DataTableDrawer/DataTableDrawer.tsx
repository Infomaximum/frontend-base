import type { ButtonProps } from "antd/lib/button/button";
import { useCallback, useEffect, useMemo, useState } from "react";
import { drawerStyle } from "./DataTableDrawer.styles";
import type {
  IDataTableDrawerProps,
  IOkButtonProps,
  IConvertedModel,
} from "./DataTableDrawer.types";
import {
  dataTableDrawerCancelButtonTestId,
  dataTableDrawerOkButtonTestId,
} from "../../../utils/TestIds";
import { filter, debounce, sortBy, isEqual, isUndefined, isEmpty, merge } from "lodash";
import { DataTableDrawerContent } from "./DataTableDrawerContent/DataTableDrawerContent";
import { observer } from "mobx-react";
import { useTheme } from "../../../decorators/hooks/useTheme";
import { DrawerAnimationInterval } from "../../../utils";
import { useMountEffect } from "../../../decorators/hooks/useMountEffect";
import { RestModel } from "../../../models/RestModel";
import { Spinner } from "../../Spinner/Spinner";
import { OptionalDrawerForm } from "../../forms/OptionalDrawerForm/OptionalDrawerForm";

const DataTableDrawerComponent = <T extends IConvertedModel = IConvertedModel>(
  props: IDataTableDrawerProps<T>
) => {
  const {
    title,
    okText,
    cancelText,
    drawerWidth,
    onClose,
    notification,
    initialValues,
    tableStore,
    optionsConfig,
    defaultOption,
    contents,
    disableSubmitFormButtonOnEmpty,
    isHasAccess,
    onSaveData,
    selectedModels,
    selectionType = "checkbox",
    queryVariables,
    isGroupSelection,
    rowDisable,
    headerMode,
    showHeader,
    invisibleRowKeys,
    requestOnMount,
    rowBuilder,
    columnConfig,
    defaultContent,
    isVirtualized,
    handlerTableDisplayValues,
    treeCheckedStateCleanSetter,
    disableSubmitFormButton,
    className,
    setFormData,
    onChange,
    placement,
    styles,
    onStartClosing,
    autoFocus,
    rowSelection,
    isLoadingOnScroll,
  } = props;

  const [isLoading, setLoadingState] = useState(true);
  const [initialSelectedKeys, setInitialSelectedKeys] = useState<string[]>();
  const theme = useTheme();

  const runLazyLoading = useMemo(
    () =>
      debounce(() => {
        setLoadingState(false);
      }, DrawerAnimationInterval),
    []
  );

  useMountEffect(() => {
    runLazyLoading();
  });

  useEffect(() => {
    if (tableStore.checkedState && !initialSelectedKeys && !isLoading && !tableStore.isLoading) {
      setInitialSelectedKeys(sortBy(tableStore.checkedState.accumulatedKeys));
    }
  }, [initialSelectedKeys, isLoading, tableStore.checkedState, tableStore.isLoading]);

  const cancelButtonProps = useMemo(
    () =>
      ({
        "test-id": dataTableDrawerCancelButtonTestId,
      }) as unknown as ButtonProps,
    []
  );

  const okButtonProps = useMemo(
    () =>
      ({
        "test-id": dataTableDrawerOkButtonTestId,
      }) as unknown as IOkButtonProps,
    []
  );

  const handleSaveData = useCallback(
    async (formValues: TDictionary, option: string) => {
      const selectedModels = tableStore.checkedState?.accumulatedModels ?? [];
      const models = filter(selectedModels, (model) => !(model instanceof RestModel));

      await onSaveData(models, formValues, option);
    },
    [onSaveData, tableStore.checkedState?.accumulatedModels]
  );

  const getDefaultContent = () => {
    /* Сперва отправляются запросы и отображается спиннер, после открытия дровера уже все готово для 
    отображения контента без тормозов интерфейса */
    const mainContent = isLoading ? (
      <Spinner />
    ) : (
      <DataTableDrawerContent<T>
        headerMode={headerMode}
        rowBuilder={rowBuilder}
        columns={columnConfig}
        showHeader={!!showHeader}
        tableStore={tableStore}
        selectionType={selectionType}
        defaultCheckedModels={selectedModels}
        isGroupSelection={isGroupSelection}
        queryVariables={queryVariables}
        rowDisable={rowDisable}
        invisibleRowKeys={invisibleRowKeys}
        requestOnMount={requestOnMount}
        isVirtualized={isVirtualized}
        handlerTableDisplayValues={handlerTableDisplayValues}
        treeCheckedStateCleanSetter={treeCheckedStateCleanSetter}
        onChange={onChange}
        rowSelection={rowSelection}
        isLoadingOnScroll={isLoadingOnScroll}
      />
    );

    return { ...defaultContent, mainContent };
  };

  const isDisableSubmitFormButton = () => {
    if (isLoading || tableStore.isLoading) {
      return true;
    }

    if (!isUndefined(disableSubmitFormButton)) {
      return disableSubmitFormButton;
    }

    if (isEqual(initialSelectedKeys, sortBy(tableStore.checkedState.accumulatedKeys))) {
      return true;
    }

    return false;
  };

  const getWidth = () => {
    if (drawerWidth) {
      return drawerWidth;
    }

    if (tableStore.isTree) {
      return theme.drawerXLargeWidth;
    }

    if (optionsConfig && !isEmpty(optionsConfig)) {
      return theme.drawerLargeWidth;
    }

    return theme.drawerMediumWidth;
  };

  const mergedDrawerStyles = useMemo(() => {
    if (styles) {
      return merge({}, drawerStyle, styles);
    }

    return drawerStyle;
  }, [styles]);

  return (
    <OptionalDrawerForm
      key="data-table-drawer-form"
      form="data-table-drawer-form"
      title={title}
      okText={String(okText)}
      cancelText={String(cancelText)}
      onSubmit={handleSaveData}
      onCancel={onClose}
      onClose={onClose}
      destroyOnClose={true}
      styles={mergedDrawerStyles}
      okButtonProps={okButtonProps}
      cancelButtonProps={cancelButtonProps}
      width={getWidth()}
      notification={notification}
      initialValues={initialValues}
      disableSubmitFormButton={isDisableSubmitFormButton()}
      disableSubmitFormButtonOnEmpty={
        disableSubmitFormButtonOnEmpty && tableStore.checkedState.accumulatedKeys?.length === 0
      }
      contents={contents}
      defaultContent={getDefaultContent()}
      optionsConfig={optionsConfig}
      defaultOption={defaultOption}
      isHasAccess={isHasAccess}
      className={className}
      setFormData={setFormData}
      placement={placement}
      onStartClosing={onStartClosing}
      autoFocus={autoFocus}
    />
  );
};

const DataTableDrawer = observer(DataTableDrawerComponent);

export { DataTableDrawer };

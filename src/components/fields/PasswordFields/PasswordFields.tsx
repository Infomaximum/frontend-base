import { PureComponent } from "react";
import type {
  IPasswordFieldsProps,
  IPasswordFieldsState,
  IPasswordValidators,
} from "./PasswordFields.types";
import {
  CURRENT_PASSWORD,
  ENTER_NEW_PASSWORD,
  REPEAT_NEW_PASSWORD,
  LATIN_UPPERCASE_LETTERS,
  LATIN_LOWERCASE_LETTERS,
  NON_ALPHABETIC_CHARACTERS,
  NUMBERS,
  NOT_LESS_SYMBOL,
} from "../../../utils/Localization/Localization";
import {
  isValidRepeatPasswordMemoize,
  isValidNewPasswordMemoize,
  passwordHasValidLength,
  passwordHasUppercase,
  passwordHasLowercase,
  passwordHasNumbers,
  passwordHasNonAlphabetic,
  isValidCurrentPasswordMemoize,
} from "./Validators";
import { Popover } from "antd";
import {
  eyeIconStyle,
  grayCheckIconStyle,
  greenCheckIconStyle,
  redCloseIconStyle,
  commonNotificationFieldStyle,
  notificationTextStyle,
  questionIconShowPopoverStyle,
  questionIconStyle,
  checkCircleGreenIconStyle,
  redCloseCircleIconStyle,
  notificationFieldStyleWithPadding,
  opacity,
  popoverInnerStyle,
  inputFieldStyle,
} from "./PasswordFields.styles";
import { map, forEach, debounce } from "lodash";
import { MIN_PASSWORD_LENGTH } from "../../../utils/const";
import {
  passwordFieldsPasswordNotificationTestId,
  passwordFieldsPopoverTestId,
  passwordFieldsHasValidLengthTestId,
  passwordFieldsHasUppercaseTestId,
  passwordFieldsHasLowercaseTestId,
  passwordFieldsHasNumbersTestId,
  passwordFieldsHasNonAlphabeticTestId,
  passwordFieldsGreenCheckIconTestId,
  passwordFieldsGrayCheckIconTestId,
  passwordFieldsRedCheckIconTestId,
  passwordFieldsFieldsValidIconTestId,
} from "../../../utils/TestIds";
import { observer } from "mobx-react";
import type { Unsubscribe } from "final-form";
import { convertToNotWhitespace, InputFormField } from "../InputField";
import {
  CheckCircleFilled,
  CheckOutlined,
  CloseCircleFilled,
  CloseOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
} from "../../Icons/Icons";
import { withLoc } from "../../../decorators/hocs/withLoc/withLoc";
import { withFormProvider } from "../../../decorators/hocs/withFormProvider/withFormProvider";
import type { Localization } from "@infomaximum/localization";

const REPEAT_NEW_PASSWORD_FIELD = "REPEAT_NEW_PASSWORD";

const currentPasswordLoc = CURRENT_PASSWORD;
const newPasswordLoc = ENTER_NEW_PASSWORD;
const repeatNewPasswordLoc = REPEAT_NEW_PASSWORD;

const passwordValidators: IPasswordValidators[] = [
  {
    validator: passwordHasValidLength,
    getMessage(localization, complexPassword) {
      const minLength = complexPassword
        ? complexPassword.getMinPasswordLength()
          ? complexPassword.getMinPasswordLength()
          : MIN_PASSWORD_LENGTH
        : MIN_PASSWORD_LENGTH;

      return `${localization.getLocalized(NOT_LESS_SYMBOL, {
        templateData: {
          minLength,
        },
        count: minLength,
      })}`;
    },
    "test-id": passwordFieldsHasValidLengthTestId,
  },
  {
    validator: passwordHasUppercase,
    getMessage(localization: Localization) {
      return localization.getLocalized(LATIN_UPPERCASE_LETTERS);
    },
    "test-id": passwordFieldsHasUppercaseTestId,
  },
  {
    validator: passwordHasLowercase,
    getMessage(localization: Localization) {
      return localization.getLocalized(LATIN_LOWERCASE_LETTERS);
    },
    "test-id": passwordFieldsHasLowercaseTestId,
  },
  {
    validator: passwordHasNumbers,
    getMessage(localization: Localization) {
      return localization.getLocalized(NUMBERS);
    },
    "test-id": passwordFieldsHasNumbersTestId,
  },
  {
    validator: passwordHasNonAlphabetic,
    getMessage(localization: Localization) {
      return localization.getLocalized(NON_ALPHABETIC_CHARACTERS);
    },
    "test-id": passwordFieldsHasNonAlphabeticTestId,
  },
];

const CheckGreenIcon = (
  <CheckOutlined
    key="greenCheckIcon"
    test-id={passwordFieldsGreenCheckIconTestId}
    css={greenCheckIconStyle}
  />
);
const CheckGrayIcon = (
  <CheckOutlined
    key="grayCheckIcon"
    test-id={passwordFieldsGrayCheckIconTestId}
    css={grayCheckIconStyle}
  />
);
const CloseRedIcon = (
  <CloseOutlined
    key="redCloseIcon"
    test-id={passwordFieldsRedCheckIconTestId}
    css={redCloseIconStyle}
  />
);
const ValidFieldIcon = (disabled?: boolean) => (
  <CheckCircleFilled
    key="fields-valid-icon"
    test-id={passwordFieldsFieldsValidIconTestId}
    style={disabled ? opacity : undefined}
    css={checkCircleGreenIconStyle}
  />
);

class PasswordFieldsComponent extends PureComponent<IPasswordFieldsProps, IPasswordFieldsState> {
  public static defaultProps = {
    withLabels: true,
    requestOnMount: true,
  };

  private unsubscribeFormProvider!: Unsubscribe | undefined;

  constructor(props: IPasswordFieldsProps) {
    super(props);

    this.state = {
      currentPasswordInputType: true,
      newPasswordInputType: true,
      repeatNewPasswordInputType: true,
      repeatNewPasswordFocus: false,
      newPasswordFieldFocus: false,
      showPopover: false,
    } as IPasswordFieldsState;
  }

  public override componentDidMount() {
    const { formProvider, passwordFieldName, complexPasswordStore } = this.props;

    complexPasswordStore.requestData();

    if (formProvider) {
      this.unsubscribeFormProvider = formProvider.subscribe(
        ({ values }) => {
          const passwordFieldState = formProvider.getFieldState(passwordFieldName);

          this.setState({
            newPasswordValue: values[passwordFieldName],
            repeatPasswordValue: values[REPEAT_NEW_PASSWORD_FIELD],
            touchedWithError:
              passwordFieldState && passwordFieldState.touched && passwordFieldState.error,
          });
        },
        {
          values: true,
          errors: true,
          touched: true,
        }
      );
    }
  }

  public override componentWillUnmount() {
    const { complexPasswordStore } = this.props;
    complexPasswordStore.clearData();

    complexPasswordStore.cancelRequest();

    this.unsubscribeFormProvider?.();
  }

  // очищает поле повторения пароля
  private handleClearRepeatPasswordField = () => {
    const { formProvider } = this.props;

    if (formProvider) {
      formProvider.mutators.clearFields?.([REPEAT_NEW_PASSWORD_FIELD]);
    }
  };

  // добавляет иконку очистки филда повторения пароля, если оно не пустое
  public handleBlurRepeatNewPassword = () => {
    const { formProvider } = this.props;

    if (!this.state.repeatNewPasswordFocus && formProvider) {
      formProvider.mutators.touch?.([this.props.passwordFieldName]);
      this.setState({ repeatNewPasswordFocus: true });
    }
  };

  // метод для показать/скрыть пароль поля currentPasswordInput
  public changeCurrentPasswordInputType = () => {
    this.setState({
      currentPasswordInputType: !this.state.currentPasswordInputType,
    });
  };

  // метод для показать/скрыть пароль поля NewPasswordInput
  public changeNewPasswordInputType = () => {
    this.setState({ newPasswordInputType: !this.state.newPasswordInputType });
  };

  // метод для показать/скрыть пароль поля RepeatNewPasswordInput
  public changeRepeatNewPasswordInputType = () => {
    this.setState({
      repeatNewPasswordInputType: !this.state.repeatNewPasswordInputType,
    });
  };

  // метод проверки валидаторов
  public getValid(): boolean {
    const { newPasswordValue } = this.state;
    const { complexPasswordStore } = this.props;

    const model = complexPasswordStore.model;

    const hardPassword = model ? model.getMinPasswordLength() : undefined;

    let valid = false;
    let validationStatuses;

    if (newPasswordValue) {
      validationStatuses = map(
        hardPassword ? passwordValidators : [passwordValidators[0]],
        (passwordValidator) => !!passwordValidator?.validator(newPasswordValue, model)
      );

      valid = true;
      forEach(validationStatuses, (status) => {
        if (status === false) {
          valid = false;
        }
      });
    }

    return valid;
  }

  // возвращает иконку состояния валидатора
  public getIcon(valueIsValid: boolean) {
    const { passwordFieldName, formProvider } = this.props;
    const passwordField = formProvider.getFieldState(passwordFieldName);

    return valueIsValid
      ? CheckGreenIcon
      : passwordField?.touched && passwordField?.invalid
      ? CloseRedIcon
      : CheckGrayIcon;
  }

  // debounce для игнорирования мгновенного focus-blur, возникающего при клике на область поля
  // за пределами input. Должно исправиться в antd v5 [PT-12981]
  private setFocusState = debounce(
    (isFocus: boolean) => this.setState({ newPasswordFieldFocus: isFocus }),
    100
  );

  public handleFocusNewPasswordField = () => {
    this.setFocusState(true);
  };

  // показать/скрыть подсказку для поля "Введите новый пароль"
  public togglePopover = () => {
    this.setState((prevState) => ({
      showPopover: !prevState.showPopover,
    }));
  };

  public handleBlurNewPasswordField = () => {
    this.setFocusState(false);
  };

  // генерирует строки валидации для Popover
  public getPassNotif = () => {
    const { localization, complexPasswordStore } = this.props;
    const { newPasswordValue } = this.state;

    const model = complexPasswordStore.model;

    const hardPassword = model ? model.getMinPasswordLength() : undefined;

    const notificationFields = map(
      hardPassword ? passwordValidators : [passwordValidators[0]],
      (passwordValidator, index) => {
        const valueIsValid: boolean = !!passwordValidator?.validator(newPasswordValue, model);

        const containerKey = `pass-notification-field-container-${index}`;
        const messageKey = `pass-notification-field-message-${index}`;

        return (
          <div
            key={containerKey}
            test-id={
              passwordValidator?.["test-id"]
                ? `${passwordFieldsPasswordNotificationTestId}_${passwordValidator["test-id"]}`
                : passwordFieldsPasswordNotificationTestId
            }
            css={
              index === passwordValidators.length - 1 || !hardPassword
                ? commonNotificationFieldStyle
                : notificationFieldStyleWithPadding
            }
          >
            {this.getIcon(valueIsValid)}
            <span key={messageKey} css={notificationTextStyle}>
              {passwordValidator?.getMessage(localization, model)}
            </span>
          </div>
        );
      }
    );

    return <div test-id={passwordFieldsPopoverTestId}>{notificationFields}</div>;
  };

  private getTriggerNode(triggerNode: HTMLElement) {
    return triggerNode;
  }

  public override render() {
    const {
      localization,
      passwordFieldName,
      currentPasswordFieldName,
      readOnly,
      withLabels,
      disabled,
      currentPasswordFieldLabel,
      currentPasswordFieldPlaceholder,
      passwordFieldLabel,
      passwordFieldPlaceholder,
      withRepeatPasswordField,
      repeatPasswordFieldLabel,
      repeatPasswordFieldPlaceholder,
      withNotEmptyValidation,
      newPasswordIcon,
      newPasswordInputType: newPasswordInputTypeProps,
      autoFocusFieldName,
      complexPasswordStore,
      formItemStyle,
    } = this.props;
    const {
      repeatPasswordValue,
      newPasswordInputType,
      repeatNewPasswordInputType,
      newPasswordValue,
      repeatNewPasswordFocus,
      showPopover,
      touchedWithError,
      newPasswordFieldFocus,
    } = this.state;

    const model = complexPasswordStore.model;

    const currentPasswordValidation = isValidCurrentPasswordMemoize(
      localization,
      passwordFieldName,
      currentPasswordFieldName,
      REPEAT_NEW_PASSWORD_FIELD,
      withNotEmptyValidation
    );

    const repeatPasswordValidation = isValidRepeatPasswordMemoize(
      localization,
      model,
      passwordFieldName,
      currentPasswordFieldName,
      REPEAT_NEW_PASSWORD_FIELD,
      withNotEmptyValidation
    );

    const newPasswordValidation = isValidNewPasswordMemoize(
      localization,
      model,
      passwordFieldName,
      currentPasswordFieldName,
      REPEAT_NEW_PASSWORD_FIELD,
      withNotEmptyValidation
    );

    const CurrentPasswordIcon = this.state.currentPasswordInputType
      ? EyeInvisibleOutlined
      : EyeOutlined;
    const NewPasswordIcon = newPasswordInputType ? EyeInvisibleOutlined : EyeOutlined;
    const RepeatNewPassIcon = repeatNewPasswordInputType ? EyeInvisibleOutlined : EyeOutlined;

    const isOpenPopover = Boolean(showPopover || (touchedWithError && newPasswordFieldFocus));

    return [
      currentPasswordFieldName ? (
        <InputFormField
          key={currentPasswordFieldName}
          name={currentPasswordFieldName}
          disabled={disabled}
          suffix={
            <CurrentPasswordIcon
              onClick={disabled ? undefined : this.changeCurrentPasswordInputType}
              css={eyeIconStyle}
              style={disabled ? opacity : undefined}
            />
          }
          label={
            withLabels
              ? currentPasswordFieldLabel || localization.getLocalized(currentPasswordLoc)
              : undefined
          }
          placeholder={currentPasswordFieldPlaceholder}
          readOnly={readOnly}
          type={this.state.currentPasswordInputType ? "password" : "text"}
          validate={currentPasswordValidation}
          parse={convertToNotWhitespace}
          autoComplete="off"
          css={inputFieldStyle}
          autoFocus={autoFocusFieldName === currentPasswordFieldName}
          formItemStyle={formItemStyle}
        />
      ) : null,
      <InputFormField
        key={passwordFieldName}
        name={passwordFieldName}
        autoComplete="off"
        validate={newPasswordValidation}
        parse={convertToNotWhitespace}
        onFocus={this.handleFocusNewPasswordField}
        onBlurCapture={this.handleBlurNewPasswordField}
        readOnly={readOnly}
        disabled={disabled}
        formItemStyle={formItemStyle}
        suffix={
          <>
            {newPasswordIcon ?? (
              <NewPasswordIcon
                onClick={disabled ? undefined : this.changeNewPasswordInputType}
                css={eyeIconStyle}
                style={disabled ? opacity : undefined}
              />
            )}
            {!this.getValid() ? (
              <Popover
                open={isOpenPopover}
                key="password-notification-popover"
                trigger="click"
                placement="right"
                content={this.getPassNotif()}
                getPopupContainer={this.getTriggerNode}
                overlayInnerStyle={popoverInnerStyle}
              >
                <QuestionCircleOutlined
                  key="question-circle-popover-icon"
                  css={isOpenPopover ? questionIconShowPopoverStyle : questionIconStyle}
                  onClick={disabled ? undefined : this.togglePopover}
                  style={disabled ? opacity : undefined}
                />
              </Popover>
            ) : (
              ValidFieldIcon(disabled)
            )}
          </>
        }
        label={
          withLabels ? passwordFieldLabel || localization.getLocalized(newPasswordLoc) : undefined
        }
        placeholder={passwordFieldPlaceholder}
        type={newPasswordInputTypeProps ?? (newPasswordInputType ? "password" : "text")}
        css={inputFieldStyle}
        autoFocus={autoFocusFieldName === passwordFieldName}
      />,
      withRepeatPasswordField ? (
        <InputFormField
          key={REPEAT_NEW_PASSWORD_FIELD}
          name={REPEAT_NEW_PASSWORD_FIELD}
          autoComplete="off"
          validate={repeatPasswordValidation}
          parse={convertToNotWhitespace}
          readOnly={readOnly}
          disabled={disabled}
          formItemStyle={formItemStyle}
          suffix={
            <>
              <RepeatNewPassIcon
                onClick={disabled ? undefined : this.changeRepeatNewPasswordInputType}
                css={eyeIconStyle}
                style={disabled ? opacity : undefined}
              />
              {newPasswordValue !== repeatPasswordValue &&
              repeatNewPasswordFocus &&
              repeatPasswordValue ? (
                <CloseCircleFilled
                  css={redCloseCircleIconStyle}
                  onClick={this.handleClearRepeatPasswordField}
                />
              ) : null}
            </>
          }
          label={
            withLabels
              ? repeatPasswordFieldLabel || localization.getLocalized(repeatNewPasswordLoc)
              : undefined
          }
          placeholder={repeatPasswordFieldPlaceholder}
          type={repeatNewPasswordInputType ? "password" : "text"}
          onBlurCapture={this.handleBlurRepeatNewPassword}
          css={inputFieldStyle}
        />
      ) : null,
    ];
  }
}

const PasswordFields = withLoc(withFormProvider(observer(PasswordFieldsComponent)));

export { PasswordFields, passwordValidators };

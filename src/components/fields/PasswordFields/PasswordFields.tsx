import { createRef, PureComponent } from "react";
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
  notificationFieldStyleWithPaddingStyle,
  opacityStyle,
  popoverInnerStyle,
  inputFieldStyle,
} from "./PasswordFields.styles";
import { map, forEach, debounce, isNumber } from "lodash";
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
  passwordFieldsNewPasswordVisibilityIconTestId,
  passwordFieldsRepeatNewPasswordVisibilityIconTestId,
  passwordFieldsCurrentPasswordVisibilityIconTestId,
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
import { getTextWidthOfReactNode } from "../../../utils/textWidth";
import { theme } from "../../../styles";

const REPEAT_NEW_PASSWORD_FIELD = "REPEAT_NEW_PASSWORD";

const currentPasswordLoc = CURRENT_PASSWORD;
const newPasswordLoc = ENTER_NEW_PASSWORD;
const repeatNewPasswordLoc = REPEAT_NEW_PASSWORD;

const passwordPopoverPaddingSumNumber = 32;
const passwordPopoverIconWidth = 16;
const passwordPopoverTextPadding = 8;
const passwordPopoverMarginWidth = 8;
const passwordPopoverReserveWidth = 8;
const passwordPopoverAdditionWidth =
  passwordPopoverPaddingSumNumber +
  passwordPopoverIconWidth +
  passwordPopoverTextPadding +
  passwordPopoverMarginWidth +
  passwordPopoverReserveWidth;

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
    style={disabled ? opacityStyle : undefined}
    css={checkCircleGreenIconStyle}
  />
);

const passwordHelpPopoverZIndex = 1040;

class PasswordFieldsComponent extends PureComponent<IPasswordFieldsProps, IPasswordFieldsState> {
  public static defaultProps = {
    withLabels: true,
    requestOnMount: true,
  };

  private passwordHelpIconRef = createRef<HTMLDivElement>();

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
      passwordPopoverDirection: "right",
    } as IPasswordFieldsState;
  }

  public override componentDidMount() {
    const { formProvider, passwordFieldName, complexPasswordStore } = this.props;

    complexPasswordStore.requestData();

    window.addEventListener("resize", this.handlePassPopoverDirectionChange);

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

    window.removeEventListener("resize", this.handlePassPopoverDirectionChange);
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
    200
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
    if (this.state.touchedWithError) {
      this.setFocusState(false);
    } else {
      this.setState({
        newPasswordFieldFocus: false,
      });
    }
  };

  public getPasswordValidatorsData = () => {
    const { complexPasswordStore } = this.props;
    const model = complexPasswordStore.model;
    const hardPassword = model ? model.getMinPasswordLength() : undefined;

    return {
      hardPassword,
      passwordValidators: hardPassword ? passwordValidators : [passwordValidators[0]],
    };
  };

  // генерирует строки валидации для Popover
  public getPassNotif = () => {
    // смена положения, при обновлении контента Popover
    this.handlePassPopoverDirectionChange();

    const { localization, complexPasswordStore } = this.props;
    const { newPasswordValue } = this.state;
    const model = complexPasswordStore.model;

    const { hardPassword, passwordValidators } = this.getPasswordValidatorsData();

    const notificationFields = map(passwordValidators, (passwordValidator, index) => {
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
              : notificationFieldStyleWithPaddingStyle
          }
        >
          {this.getIcon(valueIsValid)}
          <span key={messageKey} css={notificationTextStyle}>
            {passwordValidator?.getMessage(localization, model)}
          </span>
        </div>
      );
    });

    return <div test-id={passwordFieldsPopoverTestId}>{notificationFields}</div>;
  };

  private getPasswordPopoverDirection = () => {
    const { localization, complexPasswordStore } = this.props;

    const { passwordValidators } = this.getPasswordValidatorsData();

    const widthsOfPassPopoverElems = map(passwordValidators, (elem) => {
      const passPopoverElemWidth = getTextWidthOfReactNode(
        elem?.getMessage(localization, complexPasswordStore.model),
        {
          size: theme.h4FontSize,
        }
      );

      if (isNumber(passPopoverElemWidth)) {
        return passPopoverElemWidth;
      }

      return 0;
    });

    const passwordPopoverWidth = Math.ceil(
      Math.max(...widthsOfPassPopoverElems) + passwordPopoverAdditionWidth
    );

    if (this.passwordHelpIconRef.current) {
      if (
        document.body.clientWidth -
          this.passwordHelpIconRef.current?.getBoundingClientRect().right <
        passwordPopoverWidth
      ) {
        return "left";
      } else {
        return "right";
      }
    }
  };

  private handlePassPopoverDirectionChange = () => {
    const passwordPopoverDirection = this.getPasswordPopoverDirection();

    if (passwordPopoverDirection) {
      this.setState({
        passwordPopoverDirection,
      });
    }
  };

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
              test-id={passwordFieldsCurrentPasswordVisibilityIconTestId}
              onClick={disabled ? undefined : this.changeCurrentPasswordInputType}
              css={eyeIconStyle}
              style={disabled ? opacityStyle : undefined}
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
                test-id={passwordFieldsNewPasswordVisibilityIconTestId}
                onClick={disabled ? undefined : this.changeNewPasswordInputType}
                css={eyeIconStyle}
                style={disabled ? opacityStyle : undefined}
              />
            )}
            <div ref={this.passwordHelpIconRef}>
              {!this.getValid() ? (
                <Popover
                  open={isOpenPopover}
                  key="password-notification-popover"
                  trigger="click"
                  placement={this.state.passwordPopoverDirection}
                  content={this.getPassNotif()}
                  overlayInnerStyle={popoverInnerStyle}
                  autoAdjustOverflow={false}
                  zIndex={passwordHelpPopoverZIndex}
                >
                  <QuestionCircleOutlined
                    key="question-circle-popover-icon"
                    css={isOpenPopover ? questionIconShowPopoverStyle : questionIconStyle}
                    onClick={disabled ? undefined : this.togglePopover}
                    style={disabled ? opacityStyle : undefined}
                  />
                </Popover>
              ) : (
                ValidFieldIcon(disabled)
              )}
            </div>
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
                test-id={passwordFieldsRepeatNewPasswordVisibilityIconTestId}
                onClick={disabled ? undefined : this.changeRepeatNewPasswordInputType}
                css={eyeIconStyle}
                style={disabled ? opacityStyle : undefined}
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

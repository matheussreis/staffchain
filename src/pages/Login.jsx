import useInput from '../hooks/use-input';
import FIELD_TYPES from '../enums/field-types';
import { LoginFormContext } from '../store/login-form-context';
import LoginForm from '../components/LoginForm/LoginForm';

export default function Login() {
  const {
    value: emailValue,
    isValid: emailIsValid,
    hasError: emailHasError,
    errorMessage: emailErrorMessage,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmail,
  } = useInput([FIELD_TYPES.EMAIL, ['email']]);

  const {
    value: passwordValue,
    isValid: passwordIsValid,
    hasError: passwordHasError,
    errorMessage: passwordErrorMessage,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPassword,
  } = useInput([FIELD_TYPES.PASSWORD, [10]]);

  const fields = {
    email: {
      value: emailValue,
      isValid: emailIsValid,
      hasError: emailHasError,
      errorMessage: emailErrorMessage,
      valueChangeHandler: emailChangeHandler,
      inputBlurHandler: emailBlurHandler,
      resetField: resetEmail,
    },
    password: {
      value: passwordValue,
      isValid: passwordIsValid,
      hasError: passwordHasError,
      errorMessage: passwordErrorMessage,
      valueChangeHandler: passwordChangeHandler,
      inputBlurHandler: passwordBlurHandler,
      resetField: resetPassword,
    },
  };

  return (
    <LoginFormContext.Provider value={{ fields: fields }}>
      <LoginForm />
    </LoginFormContext.Provider>
  );
}

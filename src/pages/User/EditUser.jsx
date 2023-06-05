import useInput from '../../hooks/use-input';
import FIELD_TYPES from '../../enums/field-types';
import UserForm from '../../components/UserForm/UserForm';
import { UserFormContext } from '../../store/user-form-context';

export default function EditUser() {
  const {
    value: firstNameValue,
    isValid: firstNameIsValid,
    hasError: firstNameHasError,
    errorMessage: firstNameErrorMessage,
    valueChangeHandler: firstNameChangeHandler,
    inputBlurHandler: firstNameBlurHandler,
  } = useInput([FIELD_TYPES.TEXT, ['First Name']]);

  const {
    value: lastNameValue,
    isValid: lastNameIsValid,
    hasError: lastNameHasError,
    errorMessage: lastNameErrorMessage,
    valueChangeHandler: lastNameChangeHandler,
    inputBlurHandler: lastNameBlurHandler,
  } = useInput([FIELD_TYPES.TEXT, ['Last Name']]);

  const {
    value: emailValue,
    isValid: emailIsValid,
    hasError: emailHasError,
    errorMessage: emailErrorMessage,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
  } = useInput([FIELD_TYPES.EMAIL, ['email']]);

  const {
    value: phoneValue,
    isValid: phoneIsValid,
    hasError: phoneHasError,
    errorMessage: phoneErrorMessage,
    valueChangeHandler: phoneChangeHandler,
    inputBlurHandler: phoneBlurHandler,
  } = useInput([FIELD_TYPES.TEXT, ['Phone']]);

  const {
    value: birthdateValue,
    isValid: birthdateIsValid,
    hasError: birthdateHasError,
    errorMessage: birthdateErrorMessage,
    valueChangeHandler: birthdateChangeHandler,
    inputBlurHandler: birthdateBlurHandler,
  } = useInput([FIELD_TYPES.TEXT, ['Birth Date']]);

  const {
    value: isAdministratorValue,
    isValid: isAdministratorIsValid,
    hasError: isAdministratorHasError,
    errorMessage: isAdministratorErrorMessage,
    selectValueChangeHandler: isAdministratorChangeHandler,
    inputBlurHandler: isAdministratorBlurHandler,
  } = useInput([FIELD_TYPES.TEXT, ['Is Administrator']]);

  const {
    value: passwordValue,
    isValid: passwordIsValid,
    hasError: passwordHasError,
    errorMessage: passwordErrorMessage,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
  } = useInput([FIELD_TYPES.PASSWORD, [10]]);

  const {
    value: departmentNameValue,
    isValid: departmentNameIsValid,
    hasError: departmentNameHasError,
    errorMessage: departmentNameErrorMessage,
    valueChangeHandler: departmentNameChangeHandler,
    inputBlurHandler: departmentNameBlurHandler,
  } = useInput([FIELD_TYPES.TEXT, ['Department Name']]);

  const providerValue = {
    firstName: {
      value: firstNameValue,
      isValid: firstNameIsValid,
      hasError: firstNameHasError,
      errorMessage: firstNameErrorMessage,
      valueChangeHandler: firstNameChangeHandler,
      inputBlurHandler: firstNameBlurHandler,
    },
    lastName: {
      value: lastNameValue,
      isValid: lastNameIsValid,
      hasError: lastNameHasError,
      errorMessage: lastNameErrorMessage,
      valueChangeHandler: lastNameChangeHandler,
      inputBlurHandler: lastNameBlurHandler,
    },
    email: {
      value: emailValue,
      isValid: emailIsValid,
      hasError: emailHasError,
      errorMessage: emailErrorMessage,
      valueChangeHandler: emailChangeHandler,
      inputBlurHandler: emailBlurHandler,
    },
    phone: {
      value: phoneValue,
      isValid: phoneIsValid,
      hasError: phoneHasError,
      errorMessage: phoneErrorMessage,
      valueChangeHandler: phoneChangeHandler,
      inputBlurHandler: phoneBlurHandler,
    },
    birthdate: {
      value: birthdateValue,
      isValid: birthdateIsValid,
      hasError: birthdateHasError,
      errorMessage: birthdateErrorMessage,
      valueChangeHandler: birthdateChangeHandler,
      inputBlurHandler: birthdateBlurHandler,
    },
    isAdministrator: {
      value: isAdministratorValue,
      isValid: isAdministratorIsValid,
      hasError: isAdministratorHasError,
      errorMessage: isAdministratorErrorMessage,
      valueChangeHandler: isAdministratorChangeHandler,
      inputBlurHandler: isAdministratorBlurHandler,
    },
    password: {
      value: passwordValue,
      isValid: passwordIsValid,
      hasError: passwordHasError,
      errorMessage: passwordErrorMessage,
      valueChangeHandler: passwordChangeHandler,
      inputBlurHandler: passwordBlurHandler,
    },
    departmentName: {
      value: departmentNameValue,
      isValid: departmentNameIsValid,
      hasError: departmentNameHasError,
      errorMessage: departmentNameErrorMessage,
      valueChangeHandler: departmentNameChangeHandler,
      inputBlurHandler: departmentNameBlurHandler,
    },
  };

  return (
    <UserFormContext.Provider value={{ fields: providerValue }}>
      <UserForm />
    </UserFormContext.Provider>
  );
}

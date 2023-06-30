import { useContext } from 'react';
import useInput from '../../hooks/use-input';
import FIELD_TYPES from '../../enums/field-types';
import UserForm from '../../components/UserForm/UserForm';
import { UserFormContext } from '../../store/user-form-context';

export default function EditUser() {
  const context = useContext(UserFormContext);
  const { fields } = context;

  const {
    value: firstNameValue,
    isValid: firstNameIsValid,
    hasError: firstNameHasError,
    errorMessage: firstNameErrorMessage,
    valueChangeHandler: firstNameChangeHandler,
    inputBlurHandler: firstNameBlurHandler,
  } = useInput([FIELD_TYPES.TEXT, ['First Name']], fields.firstName.value);

  const {
    value: lastNameValue,
    isValid: lastNameIsValid,
    hasError: lastNameHasError,
    errorMessage: lastNameErrorMessage,
    valueChangeHandler: lastNameChangeHandler,
    inputBlurHandler: lastNameBlurHandler,
  } = useInput([FIELD_TYPES.TEXT, ['Last Name']], fields.lastName.value);

  const {
    value: emailValue,
    isValid: emailIsValid,
    hasError: emailHasError,
    errorMessage: emailErrorMessage,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
  } = useInput([FIELD_TYPES.EMAIL, ['email']], fields.email.value);

  const {
    value: phoneValue,
    isValid: phoneIsValid,
    hasError: phoneHasError,
    errorMessage: phoneErrorMessage,
    valueChangeHandler: phoneChangeHandler,
    inputBlurHandler: phoneBlurHandler,
  } = useInput([FIELD_TYPES.TEXT, ['Phone']], fields.phone.value);

  const {
    value: birthdateValue,
    isValid: birthdateIsValid,
    hasError: birthdateHasError,
    errorMessage: birthdateErrorMessage,
    valueChangeHandler: birthdateChangeHandler,
    inputBlurHandler: birthdateBlurHandler,
  } = useInput([FIELD_TYPES.TEXT, ['Birth Date']], fields.birthdate.value);

  const {
    value: isAdministratorValue,
    isValid: isAdministratorIsValid,
    hasError: isAdministratorHasError,
    errorMessage: isAdministratorErrorMessage,
    selectValueChangeHandler: isAdministratorChangeHandler,
    inputBlurHandler: isAdministratorBlurHandler,
  } = useInput(
    [FIELD_TYPES.TEXT, ['Is Administrator']],
    fields.isAdministrator.value
  );

  const {
    value: passwordValue,
    isValid: passwordIsValid,
    hasError: passwordHasError,
    errorMessage: passwordErrorMessage,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
  } = useInput([FIELD_TYPES.PASSWORD, [10]], fields.password?.value);

  const {
    value: departmentNameValue,
    isValid: departmentNameIsValid,
    hasError: departmentNameHasError,
    errorMessage: departmentNameErrorMessage,
    valueChangeHandler: departmentNameChangeHandler,
    inputBlurHandler: departmentNameBlurHandler,
  } = useInput(
    [FIELD_TYPES.TEXT, ['Department Name']],
    fields.departmentName.value
  );

  const {
    value: roleNameValue,
    isValid: roleNameIsValid,
    hasError: roleNameHasError,
    errorMessage: roleNameErrorMessage,
    valueChangeHandler: roleNameChangeHandler,
    inputBlurHandler: roleNameBlurHandler,
  } = useInput([FIELD_TYPES.TEXT, ['Role Name']], fields.roleName.value);

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
    roleName: {
      value: roleNameValue,
      isValid: roleNameIsValid,
      hasError: roleNameHasError,
      errorMessage: roleNameErrorMessage,
      valueChangeHandler: roleNameChangeHandler,
      inputBlurHandler: roleNameBlurHandler,
    },
  };

  return (
    <UserFormContext.Provider
      value={{ fields: { ...providerValue, id: context.fields.id } }}
    >
      <UserForm />
    </UserFormContext.Provider>
  );
}

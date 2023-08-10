import { useContext, useState } from 'react';
import Input from '../../UI/Input/Input';
import FormRow from '../../UI/Form/FormRow';
import Select from '../../UI/Select/Select';
import yesNoDom from '../../../options/yes-no-dom';
import Container from '../../UI/Container/Container';
import { UserFormContext } from '../../../store/user-form-context';
import { CurrentUserContext } from '../../../store/current-user-context';

import classes from './Step1.module.css';

export default function Step1() {
  const { fields } = useContext(UserFormContext);
  const { user } = useContext(CurrentUserContext);
  const [confirmPassword, setConfirmPassword] = useState({
    value: '',
    hasError: false,
    errorMessage: "Password doesn't match.",
  });

  const passwordChangeHandler = (event) => {
    let passwordDoesNotMatch = false;

    if (event.target.value.trim() !== confirmPassword.value) {
      passwordDoesNotMatch = true;
    }

    if (confirmPassword.value.length < 1) {
      passwordDoesNotMatch = false;
    }

    setConfirmPassword((prev) => ({
      ...prev,
      hasError: passwordDoesNotMatch,
    }));

    fields.password.valueChangeHandler(event);
  };

  const confirmPasswordChangeHandler = (event) => {
    const currentConfirmPassword = event.target.value.trim();
    let passwordDoesNotMatch = false;

    if (currentConfirmPassword !== fields.password.value) {
      passwordDoesNotMatch = true;
    }

    setConfirmPassword((prev) => ({
      ...prev,
      value: event.target.value,
      hasError: passwordDoesNotMatch,
    }));
  };

  return (
    <Container className={classes['input-container']}>
      <FormRow>
        <Input
          type="text"
          id="firstName"
          name="firstName"
          placeholder="First Name"
          onBlur={fields.firstName.inputBlurHandler}
          onChange={fields.firstName.valueChangeHandler}
          value={fields.firstName.value}
          hasError={fields.firstName.hasError}
          errorMessage={fields.firstName.errorMessage}
        />
        <Input
          type="text"
          id="lastName"
          name="lastName"
          placeholder="Last Name"
          onBlur={fields.lastName.inputBlurHandler}
          onChange={fields.lastName.valueChangeHandler}
          value={fields.lastName.value}
          hasError={fields.lastName.hasError}
          errorMessage={fields.lastName.errorMessage}
        />
      </FormRow>
      <FormRow>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          onBlur={fields.email.inputBlurHandler}
          onChange={fields.email.valueChangeHandler}
          value={fields.email.value}
          hasError={fields.email.hasError}
          errorMessage={fields.email.errorMessage}
        />
        <Input
          type="text"
          id="phone"
          name="phone"
          placeholder="Phone"
          onBlur={fields.phone.inputBlurHandler}
          onChange={fields.phone.valueChangeHandler}
          value={fields.phone.value}
          hasError={fields.phone.hasError}
          errorMessage={fields.phone.errorMessage}
        />
      </FormRow>
      <FormRow>
        <Input
          type="date"
          id="birthdate"
          name="birthdate"
          placeholder="Birth Date"
          onBlur={fields.birthdate.inputBlurHandler}
          onChange={fields.birthdate.valueChangeHandler}
          value={fields.birthdate.value}
          hasError={fields.birthdate.hasError}
          errorMessage={fields.birthdate.errorMessage}
        />
        {user.isAdmin && (
          <Select
            label="Is Administrator"
            name="isadmin"
            options={yesNoDom}
            value={fields.isAdministrator.value}
            onBlur={fields.isAdministrator.inputBlurHandler}
            onChange={fields.isAdministrator.valueChangeHandler}
            hasError={fields.isAdministrator.hasError}
            errorMessage={fields.isAdministrator.errorMessage}
          />
        )}
      </FormRow>
      <FormRow>
        <Input
          type="text"
          id="departmentName"
          name="departmentName"
          placeholder="Department Name"
          onBlur={fields.departmentName.inputBlurHandler}
          onChange={fields.departmentName.valueChangeHandler}
          value={fields.departmentName.value}
          hasError={fields.departmentName.hasError}
          errorMessage={fields.departmentName.errorMessage}
        />
        <Input
          type="text"
          id="roleName"
          name="roleName"
          placeholder="Role Name"
          onBlur={fields.roleName.inputBlurHandler}
          onChange={fields.roleName.valueChangeHandler}
          value={fields.roleName.value}
          hasError={fields.roleName.hasError}
          errorMessage={fields.roleName.errorMessage}
        />
      </FormRow>
      {user.isAdmin && (
        <FormRow>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            onBlur={fields.password.inputBlurHandler}
            onChange={passwordChangeHandler}
            value={fields.password.value}
            hasError={fields.password.hasError}
            errorMessage={fields.password.errorMessage}
          />
          <Input
            type="password"
            id="confirm-password"
            name="confirm-password"
            placeholder="Confirm Password"
            onChange={confirmPasswordChangeHandler}
            value={confirmPassword.value}
            errorMessage={confirmPassword.errorMessage}
            hasError={confirmPassword.hasError}
          />
        </FormRow>
      )}
    </Container>
  );
}

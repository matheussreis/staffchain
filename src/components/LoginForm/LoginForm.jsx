import { useContext } from 'react';
import Form from '../UI/Form/Form';
import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';
import FormTitle from '../UI/Form/FormTitle';
import Container from '../UI/Container/Container';
import { LoginFormContext } from '../../store/login-form-context';

import classes from './LoginForm.module.css';

export default function LoginForm() {
  const { fields } = useContext(LoginFormContext);

  let formIsValid = false;

  if (fields.email.isValid && fields.password.isValid) {
    formIsValid = true;
  }

  const submitFormHandler = (event) => {
    event.preventDefault();

    if (!formIsValid) {
      return;
    }

    console.log('Submitted!');

    fields.email.resetField();
    fields.password.resetField();
  };

  return (
    <Container className={classes['form-container']}>
      <Form className={classes.form} onSubmit={submitFormHandler}>
        <FormTitle text="Please Login" />
        <Container className={classes['input-container']}>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            isSingleLine
            onBlur={fields.email.inputBlurHandler}
            onChange={fields.email.valueChangeHandler}
            value={fields.email.value}
            hasError={fields.email.hasError}
            errorMessage={fields.email.errorMessage}
          />
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            isSingleLine
            onBlur={fields.password.inputBlurHandler}
            onChange={fields.password.valueChangeHandler}
            value={fields.password.value}
            hasError={fields.password.hasError}
            errorMessage={fields.password.errorMessage}
          />
        </Container>

        <Button disabled={!formIsValid} type="submit">
          Login
        </Button>
      </Form>
    </Container>
  );
}

import axios from 'axios';
import Form from '../UI/Form/Form';
import Input from '../UI/Input/Input';
import { Toast } from 'primereact/toast';
import Button from '../UI/Button/Button';
import { useNavigate } from 'react-router';
import { useContext, useRef } from 'react';
import FormTitle from '../UI/Form/FormTitle';
import Container from '../UI/Container/Container';
import { LoginFormContext } from '../../store/login-form-context';
import { setAuthToken, setTokenExpiration } from '../../utils/auth-utils';

import classes from './LoginForm.module.css';

export default function LoginForm() {
  const { fields } = useContext(LoginFormContext);
  const navigate = useNavigate();
  const toastRef = useRef(null);

  let formIsValid = false;

  if (fields.email.isValid && fields.password.isValid) {
    formIsValid = true;
  }

  const submitFormHandler = async (event) => {
    event.preventDefault();
    if (!formIsValid) return;

    const { REACT_APP_SERVER_API_URL: API_URL } = process.env;

    try {
      const response = await axios.post(`${API_URL}/user/login`, {
        email: fields.email.value,
        password: fields.password.value,
      });

      const { token } = await response.data;
      setAuthToken(token);
      setTokenExpiration();

      fields.email.resetField();
      fields.password.resetField();

      navigate('/');
    } catch (error) {
      let errorMessage = error.message;
      if (error.response.status === 401) {
        errorMessage = error.response.data.message;
      }

      toastRef.current.clear();
      toastRef.current.show({
        severity: 'error',
        summary: 'Authentication Failure',
        detail: errorMessage,
        sticky: true,
        style: { margin: '0.5rem' },
      });
    }
  };

  return (
    <>
      <Toast
        ref={toastRef}
        position="top-center"
        style={{ position: 'relative' }}
      />
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
    </>
  );
}

import Input from '../../UI/Input/Input';
import { useContext, useEffect } from 'react';
import Container from '../../UI/Container/Container';
import { ProcessFormContext } from '../../../store/process-form-context';

import classes from './Step1.module.css';

export default function Step1() {
  const { step1 } = useContext(ProcessFormContext);

  useEffect(() => {
    step1.setIsValid(
      step1.fields.name.isValid && step1.fields.description.isValid
    );
  }, [step1]);

  return (
    <Container className={classes['input-container']}>
      <Input
        isSingleLine
        type="text"
        id="name"
        name="name"
        placeholder="Name"
        onBlur={step1.fields.name.inputBlurHandler}
        onChange={step1.fields.name.valueChangeHandler}
        value={step1.fields.name.value}
        hasError={step1.fields.name.hasError}
        errorMessage={step1.fields.name.errorMessage}
        required
      />
      <Input
        isSingleLine
        type="textarea"
        id="description"
        name="description"
        placeholder="Description"
        onBlur={step1.fields.description.inputBlurHandler}
        onChange={step1.fields.description.valueChangeHandler}
        value={step1.fields.description.value}
        hasError={step1.fields.description.hasError}
        errorMessage={step1.fields.description.errorMessage}
        required
      />
    </Container>
  );
}

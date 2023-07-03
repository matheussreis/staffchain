import { v4 as uuid } from 'uuid';
import List from '../../UI/List/List';
import Input from '../../UI/Input/Input';
import Button from '../../UI/Button/Button';
import FormRow from '../../UI/Form/FormRow';
import Select from '../../UI/Select/Select';
import { useContext, useEffect } from 'react';
import useInput from '../../../hooks/use-input';
import yesNoDom from '../../../options/yes-no-dom';
import FIELD_TYPES from '../../../enums/field-types';
import Container from '../../UI/Container/Container';
import { fieldTypesDom } from '../../../options/field-types-dom';
import { ProcessFormContext } from '../../../store/process-form-context';

import classes from './Step2.module.css';

function ProcessField({ id, name, type, required, onRemove }) {
  return (
    <Container className={classes['field-container']}>
      <div className={classes.field}>
        <label>Name:</label>
        <span>{name}</span>
      </div>
      <div className={classes.field}>
        <label>Type:</label>
        <span>{type}</span>
      </div>
      <div className={classes.field}>
        <label>Is Required?:</label>
        <span>{required}</span>
      </div>
      <div className={classes.field}>
        <Button
          className={classes['field-button']}
          onClick={() => {
            onRemove(id);
          }}
        >
          Remove
        </Button>
      </div>
    </Container>
  );
}

export default function Step2() {
  const { step2 } = useContext(ProcessFormContext);

  const {
    value: fieldNameValue,
    isValid: fieldNameIsValid,
    hasError: fieldNameHasError,
    errorMessage: fieldNameErrorMessage,
    valueChangeHandler: fieldNameChangeHandler,
    inputBlurHandler: fieldNameBlurHandler,
    reset: resetFieldName,
  } = useInput([FIELD_TYPES.TEXT, ['Field Name']]);

  const {
    value: fieldTypeValue,
    isValid: fieldTypeIsValid,
    hasError: fieldTypeHasError,
    errorMessage: fieldTypeErrorMessage,
    selectValueChangeHandler: fieldTypeChangeHandler,
    inputBlurHandler: fieldTypeBlurHandler,
    reset: resetFieldType,
  } = useInput([FIELD_TYPES.TEXT, ['Field Type']]);

  const {
    value: requiredValue,
    isValid: requiredIsValid,
    hasError: requiredHasError,
    errorMessage: requiredErrorMessage,
    selectValueChangeHandler: requiredChangeHandler,
    inputBlurHandler: requiredBlurHandler,
    reset: resetRequired,
  } = useInput([FIELD_TYPES.TEXT, ['Is Field Required?']]);

  const addFieldHandler = () => {
    step2.processMetadata.setFields([
      ...step2.processMetadata.fields,
      {
        id: uuid(),
        name: fieldNameValue,
        type: fieldTypeValue,
        required: requiredValue,
      },
    ]);

    resetFieldName();
    resetFieldType();
    resetRequired();
  };

  const removeFieldById = (id) => {
    const fields = step2.processMetadata.fields.filter(
      (field) => field.id !== id
    );
    step2.processMetadata.setFields(fields);
  };

  useEffect(() => {
    step2.setIsValid(step2.processMetadata.fields.length > 0);
  }, [step2]);

  return (
    <>
      <Container className={classes['input-container']}>
        <FormRow>
          <Input
            type="text"
            id="fieldName"
            name="Field Name"
            placeholder="Field Name"
            className={classes.input}
            value={fieldNameValue}
            onBlur={fieldNameBlurHandler}
            onChange={fieldNameChangeHandler}
            hasError={fieldNameHasError}
            errorMessage={fieldNameErrorMessage}
          />
          <Select
            label="Field Type"
            name="fieldtype"
            options={fieldTypesDom}
            className={classes.input}
            value={fieldTypeValue}
            onBlur={fieldTypeBlurHandler}
            onChange={fieldTypeChangeHandler}
            hasError={fieldTypeHasError}
            errorMessage={fieldTypeErrorMessage}
          />
          <Select
            label="Is Field Required?"
            name="required"
            options={yesNoDom}
            className={classes.input}
            value={requiredValue}
            onBlur={requiredBlurHandler}
            onChange={requiredChangeHandler}
            hasError={requiredHasError}
            errorMessage={requiredErrorMessage}
          />
          <Button
            disabled={
              !(fieldNameIsValid && fieldTypeIsValid && requiredIsValid)
            }
            className={classes.button}
            onClick={addFieldHandler}
          >
            Add
          </Button>
        </FormRow>
        {step2.processMetadata && step2.processMetadata.fields && (
          <List className={classes.list}>
            {step2.processMetadata.fields.map((field) => (
              <ProcessField
                id={field.id}
                key={field.id}
                name={field.name}
                type={field.type.label}
                required={field.required.label}
                onRemove={removeFieldById}
              />
            ))}
          </List>
        )}
      </Container>
    </>
  );
}

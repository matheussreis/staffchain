import Input from '../../UI/Input/Input';
import FIELD_TYPES from '../../../enums/field-types';
import Container from '../../UI/Container/Container';
import FileUpload from '../../UI/FileUpload/FileUpload';
import { useContext, useEffect, useState } from 'react';
import { getValidatorByInputType } from '../../../utils/enum-utils';
import { RequestFormContext } from '../../../store/request-form-context';

import classes from './Step1.module.css';

export default function Step1() {
  const { request } = useContext(RequestFormContext);

  const [originalFieldValues, setOriginalFieldValues] = useState();

  const [formValues, setFormValues] = useState({
    fields: {},
    overallValidity: true,
  });

  const validateField = (field, value) => {
    const validator = getValidatorByInputType(field.type);
    validator.validate(value, field.name, field.required);

    setFormValues((current) => {
      const newFormFields = {
        ...current.fields,
        [field.id]: {
          isValid: validator.isValid,
          errorMessage: validator.errorMessage,
        },
      };

      const fieldsValidity = Object.values(newFormFields).every(
        (value) => typeof value === 'object' && value.isValid
      );

      return {
        fields: { ...newFormFields },
        overallValidity: fieldsValidity,
      };
    });
  };

  const handleChange = (field, index) => {
    return (event) => {
      if (!event) {
        validateField(field, undefined);
        request.fields[index].value = undefined;
        return;
      }

      let newValue = event.target.value;

      if (event.target.type === FIELD_TYPES.FILE) {
        newValue = event.target.files[0];
      }

      validateField(field, newValue);
      request.fields[index].value = newValue;
    };
  };

  useEffect(() => {
    request.setIsValid(formValues.overallValidity);
  }, [formValues.overallValidity, request]);

  useEffect(() => {
    if (!originalFieldValues) {
      setOriginalFieldValues(request.fields);
    }
  }, [originalFieldValues, request.fields]);

  return (
    <Container className={classes['input-container']}>
      {request.fields.map((field, index) => {
        const type = field.type;

        if (type === FIELD_TYPES.FILE) {
          return (
            <FileUpload
              key={field.id}
              className={classes.file}
              placeholder={field.name}
              onChange={handleChange(field, index)}
              hasError={formValues.fields[field.id]?.isValid === false || false}
              errorMessage={formValues.fields[field.id]?.errorMessage || ''}
              defaultValue={field?.value}
              isSingleLine
            />
          );
        }

        return (
          <Input
            onChange={handleChange(field, index)}
            placeholder={field.name}
            type={type}
            key={field.id}
            value={field.value}
            hasError={formValues.fields[field.id]?.isValid === false || false}
            errorMessage={formValues.fields[field.id]?.errorMessage || ''}
            isSingleLine
          />
        );
      })}
    </Container>
  );
}

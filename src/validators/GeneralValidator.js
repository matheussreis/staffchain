import isEmpty from 'lodash.isempty';
import isString from 'lodash.isstring';
import BaseValidator from './BaseValidator';

export default class GeneralValidator extends BaseValidator {
  constructor() {
    super();
    this.isValid = true;
    this.errorMessage = '';
  }

  isValueEmpty(value) {
    return isEmpty(value);
  }

  isValueString(value) {
    return isString(value);
  }

  isValueNumber(value) {
    return !isNaN(value);
  }

  validate(value, fieldName) {
    this.isValid = !this.isValueEmpty(value);

    if (this.isValid) {
      this.errorMessage = '';
    } else if (!this.isValueEmpty(fieldName)) {
      this.errorMessage = `${fieldName} cannot be empty`;
    } else {
      this.errorMessage = 'Field cannot be empty';
    }
  }
}

import FIELD_TYPES from '../enums/field-types';
import EmailValidator from './EmailValidator';
import GeneralValidator from './GeneralValidator';
import NumberValidator from './NumberValidator';
import PasswordValidator from './PasswordValidator';

export default class ValidatorFactory {
  #fieldType = FIELD_TYPES.TEXT;

  constructor(fieldType) {
    this.#fieldType = fieldType || FIELD_TYPES.TEXT;
  }

  #validatorClassHandler(fieldType) {
    switch (fieldType) {
      case FIELD_TYPES.EMAIL:
        return EmailValidator;
      case FIELD_TYPES.PASSWORD:
        return PasswordValidator;
      case FIELD_TYPES.NUMBER:
        return NumberValidator;
      default:
        return GeneralValidator;
    }
  }

  getValidator() {
    const ValidatorClass = this.#validatorClassHandler(this.#fieldType);
    const validator = new ValidatorClass();
    return validator;
  }
}

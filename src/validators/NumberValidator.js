import GeneralValidator from './GeneralValidator';

export default class NumberValidator extends GeneralValidator {
  #isValueNegative(value) {
    return this.isValueNumber(value) && value < 0;
  }

  validate(value, fieldName = 'Value', isRequired = true) {
    super.validate(value, fieldName, isRequired);
    if (!this.isValid) return;

    switch (true) {
      case !this.isValueNumber(value):
        this.errorMessage = `${fieldName} must be a number`;
        this.isValid = false;
        break;
      case this.#isValueNegative(value):
        this.errorMessage = `${fieldName} must be a greater than 0`;
        this.isValid = false;
        break;
      default:
        this.errorMessage = undefined;
        this.isValid = true;
        break;
    }
  }
}

import GeneralValidator from './GeneralValidator';

export default class NumberValidator extends GeneralValidator {
  #isValueNegative(value) {
    return this.isValueNumber(value) && value < 0;
  }

  validate(value) {
    switch (true) {
      case this.isValueEmpty(value):
        this.errorMessage = 'Field cannot be empty';
        this.isValid = false;
        break;
      case !this.isValueNumber(value):
        this.errorMessage = 'Value must be a number';
        this.isValid = false;
        break;
      case !this.#isValueNegative(value):
        this.errorMessage = 'Value must be a greater than 0';
        this.isValid = false;
        break;
      default:
        this.errorMessage = undefined;
        this.isValid = true;
        break;
    }
  }
}

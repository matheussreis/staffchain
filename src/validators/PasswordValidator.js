import GeneralValidator from './GeneralValidator';

export default class PasswordValidator extends GeneralValidator {
  constructor() {
    super();
    this.minimumLength = 6;
  }

  #isPasswordMinimumLengthInvalid(value) {
    return this.isValueString(value) && value.length < this.minimumLength;
  }

  validate(value, minimumLength) {
    this.minimumLength = minimumLength || this.minimumLength;

    switch (true) {
      case this.isValueEmpty(value):
        this.errorMessage = 'Password cannot be empty';
        this.isValid = false;
        break;
      case this.#isPasswordMinimumLengthInvalid(value):
        this.errorMessage = `Password must have at least ${this.minimumLength} characters.`;
        this.isValid = false;
        break;
      default:
        this.errorMessage = undefined;
        this.isValid = true;
        break;
    }
  }
}

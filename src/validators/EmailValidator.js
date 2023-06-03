import GeneralValidator from './GeneralValidator';

export default class EmailValidator extends GeneralValidator {
  #EMAIL_PATTERN =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  #hasEmailBadFormat(value) {
    return this.isValueString(value) && !value.match(this.#EMAIL_PATTERN);
  }

  validate(value) {
    switch (true) {
      case this.isValueEmpty(value):
        this.errorMessage = 'Email cannot be empty';
        this.isValid = false;
        break;
      case this.#hasEmailBadFormat(value):
        this.errorMessage = 'Invalid email';
        this.isValid = false;
        break;
      default:
        this.errorMessage = undefined;
        this.isValid = true;
        break;
    }
  }
}

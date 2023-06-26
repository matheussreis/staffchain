import GeneralValidator from './GeneralValidator';

export default class EmailValidator extends GeneralValidator {
  #EMAIL_PATTERN =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  #hasEmailBadFormat(value) {
    return this.isValueString(value) && !value.match(this.#EMAIL_PATTERN);
  }

  validate(value, fieldName = 'Email', isRequired = true) {
    super.validate(value, fieldName, isRequired);
    if (!this.isValid) return;

    switch (true) {
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

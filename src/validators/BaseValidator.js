export default class BaseValidator {
  constructor() {
    if (this.constructor === BaseValidator) {
      throw new Error('BaseValidator cannot be instantiated.');
    }
  }

  validate(value) {
    throw new Error('validate method must be implemented.');
  }
}

import GeneralValidator from './GeneralValidator';

export default class PasswordValidator extends GeneralValidator {
  #MINIMUM_CHARACTERS = 3;
  #UPPERCASE_REGEX = /[A-Z]/g;
  #LOWERCASE_REGEX = /[a-z]/g;
  #NUMBER_REGEX = /\d/g;
  #SPECIAL_CHARACTER_REGEX = /[!@#$%^&*()_+[\]{};':"\\|,.<>/?]/g;

  constructor() {
    super();
    this.minimumLength = 6;
  }

  #isPasswordMinimumLengthInvalid(value) {
    return this.isValueString(value) && value.length < this.minimumLength;
  }

  #notEnoughNumbers(value) {
    return (
      (value.match(this.#NUMBER_REGEX)?.length ?? 0) < this.#MINIMUM_CHARACTERS
    );
  }

  #notEnoughSpecialCharacters(value) {
    return (
      (value.match(this.#SPECIAL_CHARACTER_REGEX)?.length ?? 0) <
      this.#MINIMUM_CHARACTERS
    );
  }

  #notEnoughUppercaseCharacters(value) {
    return (
      (value.match(this.#UPPERCASE_REGEX)?.length ?? 0) <
      this.#MINIMUM_CHARACTERS
    );
  }

  #notEnoughLowercaseCharacters(value) {
    return (
      (value.match(this.#LOWERCASE_REGEX)?.length ?? 0) <
      this.#MINIMUM_CHARACTERS
    );
  }

  validate(
    value,
    minimumLength,
    skipStrengthCheck = false,
    fieldName = 'Password',
    isRequired = true
  ) {
    this.minimumLength = minimumLength || this.minimumLength;

    super.validate(value, fieldName, isRequired);
    if (!this.isValid) return;

    switch (true) {
      case this.isValueEmpty(value):
        this.errorMessage = 'Password cannot be empty';
        this.isValid = false;
        break;
      case !skipStrengthCheck && this.#notEnoughLowercaseCharacters(value):
        this.errorMessage = `Password must have at least ${
          this.#MINIMUM_CHARACTERS
        } lowercase characters.`;
        this.isValid = false;
        break;
      case !skipStrengthCheck && this.#notEnoughUppercaseCharacters(value):
        this.errorMessage = `Password must have at least ${
          this.#MINIMUM_CHARACTERS
        } uppercase characters.`;
        this.isValid = false;
        break;
      case !skipStrengthCheck && this.#notEnoughSpecialCharacters(value):
        this.errorMessage = `Password must have at least ${
          this.#MINIMUM_CHARACTERS
        } special characters.`;
        this.isValid = false;
        break;
      case !skipStrengthCheck && this.#notEnoughNumbers(value):
        this.errorMessage = `Password must have at least ${
          this.#MINIMUM_CHARACTERS
        } numbers.`;
        this.isValid = false;
        break;
      case !skipStrengthCheck && this.#isPasswordMinimumLengthInvalid(value):
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

import FIELD_TYPES from '../enums/field-types';
import ValidatorFactory from '../validators/ValidatorFactory';

export function getValidatorByInputType(type) {
  if (!Object.values(FIELD_TYPES).includes(type)) {
    throw new Error('Invalid Field Type');
  }

  const factory = new ValidatorFactory(type);
  return factory.getValidator();
}

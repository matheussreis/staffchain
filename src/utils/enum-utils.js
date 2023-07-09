import FIELD_TYPES from '../enums/field-types';
import ValidatorFactory from '../validators/ValidatorFactory';

export function getValidatorByInputType(type) {
  if (!Object.values(FIELD_TYPES).includes(type)) {
    throw new Error('Invalid Field Type');
  }

  const factory = new ValidatorFactory(type);
  return factory.getValidator();
}

export function getTagSeverityByRequestStatus(status) {
  switch (status) {
    case 'in-progress':
      return 'info';
    case 'waiting-for-info':
      return 'warning';
    case 'done':
      return 'success';
    case 'closed':
      return 'danger';
    default:
      return 'info';
  }
}

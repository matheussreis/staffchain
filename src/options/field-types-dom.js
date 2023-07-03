export const fieldTypesDom = [
  { value: 'text', label: 'Text' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'email', label: 'Email' },
  { value: 'file', label: 'File' },
];

export function translateOption(value) {
  for (const option of fieldTypesDom) {
    if (option.value === value) {
      return option.label;
    }
  }

  throw new Error('Invalid Field Type Value.');
}

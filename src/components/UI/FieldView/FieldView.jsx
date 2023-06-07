import FIELD_TYPES from '../../../enums/field-types';

import classes from './FieldView.module.css';

const getFormattedContent = (content, type) => {
  // add validation for content as a date
  if (type === FIELD_TYPES.DATE) {
    const date = new Date(content);
    return date.toLocaleDateString();
  }

  return content;
};

export default function FieldView({ label, content, type = FIELD_TYPES.TEXT }) {
  return (
    <div className={classes.container}>
      <label>{label}</label>
      <p>{getFormattedContent(content, type)}</p>
    </div>
  );
}

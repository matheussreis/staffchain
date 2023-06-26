import FIELD_TYPES from '../../../enums/field-types';

import classes from './FieldView.module.css';

const getFormattedContent = (content, type) => {
  switch (type) {
    case FIELD_TYPES.DATE:
      const date = new Date(content);
      return date.toLocaleDateString();
    case FIELD_TYPES.FILE:
      const fileName = content.substring(
        content.lastIndexOf('/') + 1,
        content.length
      );
      return fileName;
    default:
      return content;
  }
};

export default function FieldView({ label, content, type = FIELD_TYPES.TEXT }) {
  return (
    <div className={classes.container}>
      <label>{label}</label>
      <p className={type === FIELD_TYPES.FILE ? classes['file-container'] : ''}>
        {getFormattedContent(content, type)}
      </p>
    </div>
  );
}

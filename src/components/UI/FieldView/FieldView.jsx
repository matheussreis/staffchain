import FIELD_TYPES from '../../../enums/field-types';

import classes from './FieldView.module.css';

const getFormattedContent = (content, type) => {
  switch (type) {
    case FIELD_TYPES.DATE:
      const date = new Date(content);
      return date.toLocaleDateString();
    case FIELD_TYPES.FILE:
      if (typeof content === 'object') {
        return content.name;
      }

      const fileName = content.substring(
        content.lastIndexOf('/') + 1,
        content.length
      );
      return fileName;
    default:
      return content;
  }
};

export default function FieldView({
  label,
  content,
  className,
  type = FIELD_TYPES.TEXT,
}) {
  const getCssClasses = (initialClass = '') => {
    let cssClasses = classes[initialClass];

    if (className) {
      cssClasses += ` ${className}`;
    }

    return cssClasses;
  };

  return (
    <div className={getCssClasses('container')}>
      {label && <label>{label}</label>}
      <p className={type === FIELD_TYPES.FILE ? classes['file-container'] : ''}>
        {getFormattedContent(content, type)}
      </p>
    </div>
  );
}

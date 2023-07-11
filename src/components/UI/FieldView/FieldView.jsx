import Anchor from '../Anchor/Anchor';
import FIELD_TYPES from '../../../enums/field-types';

import classes from './FieldView.module.css';

const formatDateContent = (content) => {
  const date = new Date(content);
  return date.toLocaleDateString();
};

const formatFileContent = (content) => {
  if (typeof content === 'object') {
    return content.name;
  }

  const fileName = content.substring(
    content.lastIndexOf('/') + 1,
    content.length
  );

  return fileName;
};

const Field = ({ type, content, downloadUrl }) => {
  switch (type) {
    case FIELD_TYPES.DATE:
      return <p>{formatDateContent(content)}</p>;
    case FIELD_TYPES.FILE:
      return (
        <Anchor
          to={downloadUrl}
          className={classes.file}
          download={formatFileContent(content)}
          target="_blank"
        >
          {formatFileContent(content)}
        </Anchor>
      );
    default:
      return <p>{content}</p>;
  }
};

export default function FieldView({
  label,
  content,
  className,
  type = FIELD_TYPES.TEXT,
  downloadUrl = undefined,
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
      <Field type={type} content={content} downloadUrl={downloadUrl} />
    </div>
  );
}

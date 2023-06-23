import React from 'react';
import classes from './Step2.module.css';
import useEditPageCheck from '../../../hooks/use-edit-page-check';

const createContent = `The new user has been notified and from now the user will be able to access the system.`;
const editContent = `The user has been updated and from now the user will see the changes applied.`;

export default React.memo(function Step2() {
  const isEdit = useEditPageCheck();

  const title = `The user has been successfully ${
    isEdit ? 'updated' : 'created'
  }!`;

  const content = isEdit ? editContent : createContent;

  return (
    <div className={classes.container}>
      <h3 className={classes.title}>{title}</h3>
      <p className={classes.text}>{content}</p>
    </div>
  );
});

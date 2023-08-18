import useEditPageCheck from '../../../hooks/use-edit-page-check';

import classes from './Step2.module.css';

export default function Step2() {
  const isEdit = useEditPageCheck();

  return (
    <div className={classes.container}>
      <h3>
        The request has been successfully {isEdit ? 'updated' : 'created'}!
      </h3>
      {!isEdit && (
        <p className={classes.text}>
          The reviewer has been notified about your request, and will soon take
          an action.
        </p>
      )}
    </div>
  );
}

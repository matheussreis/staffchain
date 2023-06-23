import useEditPageCheck from '../../../hooks/use-edit-page-check';

import classes from './Step5.module.css';

export default function Step5() {
  const isEdit = useEditPageCheck();

  return (
    <div className={classes.container}>
      <h3>
        The process has been successfully {isEdit ? 'updated' : 'created'}!
      </h3>
      <p className={classes.text}>
        Now, all the users you have added will be able to interact with this
        process.
      </p>
    </div>
  );
}

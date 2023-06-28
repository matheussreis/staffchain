import useEditPageCheck from '../../../hooks/use-edit-page-check';

import classes from './Step2.module.css';

export default function Step2() {
  const isEdit = useEditPageCheck();

  return (
    <div className={classes.container}>
      <h3>
        The request has been successfully {isEdit ? 'updated' : 'created'}!
      </h3>
      {/* Add dynamic message based on the request reviewer */}
    </div>
  );
}

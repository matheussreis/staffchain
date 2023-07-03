import { useContext } from 'react';
import Card from '../UI/Card/Card';
import List from '../UI/List/List';
import Button from '../UI/Button/Button';
import FormRow from '../UI/Form/FormRow';
import { useNavigate } from 'react-router';
import FieldView from '../UI/FieldView/FieldView';
import FIELD_TYPES from '../../enums/field-types';
import { ProcessFormContext } from '../../store/process-form-context';

import classes from './ProcessFormView.module.css';

function UserList({ step4 }) {
  return (
    <div className={classes['user-list-container']}>
      <label className={classes['field-label']}>Users</label>
      <List className={classes['user-list']} scrollable>
        {step4.requestTree.selectedUsers &&
          Object.values(step4.requestTree.selectedUsers).map((user) => (
            <li key={user.id} className={classes['list-container']}>
              <div className={classes.field}>
                <label>Name:</label>
                <p>{user.name}</p>
              </div>

              <div className={classes.field}>
                <label>Department:</label>
                <p>{user.department}</p>
              </div>

              <div className={classes.field}>
                <label>Role:</label>
                <p>{user.role}</p>
              </div>

              <div className={classes.field}>
                <label>Reports-To:</label>
                <p>{user.reportsTo.name}</p>
              </div>
            </li>
          ))}
      </List>
    </div>
  );
}

function FieldList({ step2 }) {
  return (
    <div className={classes['user-list-container']}>
      <label className={classes['field-label']}>Fields</label>
      <List className={classes['user-list']} scrollable>
        {step2.processMetadata &&
          step2.processMetadata.fields.map((field) => (
            <li key={field.id} className={classes['list-container']}>
              <div className={classes.field}>
                <label>Name:</label>
                <p>{field.name}</p>
              </div>
              <div className={classes.field}>
                <label>Type:</label>
                <p>{field.type.label}</p>
              </div>
              <div className={classes.field}>
                <label>Is Required?:</label>
                <p>{field.required.label}</p>
              </div>
            </li>
          ))}
      </List>
    </div>
  );
}

export default function ProcessFormView() {
  const navigate = useNavigate();
  const { id, step1, step2, step3, step4 } = useContext(ProcessFormContext);

  return (
    <Card className={classes.card}>
      <h1 className={classes.title}>{step1.fields.name.value}</h1>
      <FormRow>
        <FieldView label="Name" content={step1.fields.name.value} />
        <FieldView
          label="Description"
          content={step1.fields.description.value}
          type={FIELD_TYPES.TEXTAREA}
        />
      </FormRow>
      <FormRow>
        <FieldList step2={step2} />
        <UserList step4={step4} />
      </FormRow>
      <FormRow>
        <Button
          onClick={() =>
            navigate('edit', {
              state: {
                id: id,
                step1: step1,
                step2: step2,
                step3: step3,
                step4: step4,
              },
            })
          }
        >
          Edit
        </Button>
      </FormRow>
    </Card>
  );
}

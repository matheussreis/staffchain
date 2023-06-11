import { useContext } from 'react';
import Card from '../UI/Card/Card';
import FormRow from '../UI/Form/FormRow';
import Button from '../UI/Button/Button';
import { useNavigate } from 'react-router';
import FieldView from '../UI/FieldView/FieldView';
import FIELD_TYPES from '../../enums/field-types';
import { UserFormContext } from '../../store/user-form-context';

import classes from './UserFormView.module.css';

export default function UserFormView() {
  const navigate = useNavigate();
  const { fields } = useContext(UserFormContext);

  return (
    <Card className={classes.card}>
      <h1 className={classes.title}>
        {fields.firstName.value} {fields.lastName.value} -{' '}
        {fields.departmentName.value}
      </h1>
      <FormRow>
        <FieldView label="First Name" content={fields.firstName.value} />
        <FieldView label="Last Name" content={fields.lastName.value} />
      </FormRow>
      <FormRow>
        <FieldView label="Email" content={fields.email.value} />
        <FieldView label="Phone" content={fields.phone.value} />
      </FormRow>
      <FormRow>
        <FieldView
          label="Birth Date"
          content={fields.birthdate.value}
          type={FIELD_TYPES.DATE}
        />
        <FieldView
          label="is Administrator?"
          content={fields.isAdministrator.value.label}
        />
      </FormRow>
      <FormRow>
        <FieldView
          label="Department Name"
          content={fields.departmentName.value}
        />
        <FieldView label="Role Name" content={fields.roleName.value} />
      </FormRow>
      <FormRow>
        <Button onClick={() => navigate('edit')}>Edit</Button>
      </FormRow>
    </Card>
  );
}

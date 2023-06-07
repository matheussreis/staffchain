import EditUser from './EditUser';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import useEditPageCheck from '../../hooks/use-edit-page-check';
import { UserFormContext } from '../../store/user-form-context';
import UserFormView from '../../components/UserForm/UserFormView';

export default function User() {
  const { id: userId } = useParams();
  const isEdit = useEditPageCheck('user');

  const [fields, setFields] = useState({
    firstName: { value: '' },
    lastName: { value: '' },
    email: { value: '' },
    phone: { value: '' },
    birthdate: { value: '' },
    isAdministrator: { value: '' },
    departmentName: { value: '' },
    password: { value: '' },
  });

  useEffect(() => {
    // Call API using the user ID to fetch the user data.
    console.log(`USER ID = ${userId} | FETCH USER DATA TO DISPLAY`);
    setFields({
      firstName: { value: 'John' },
      lastName: { value: 'Doe' },
      email: { value: 'johndoe@test.com' },
      phone: { value: '123321123' },
      birthdate: { value: '1997-01-01' },
      isAdministrator: { value: { label: 'Yes', value: '1' } },
      departmentName: { value: 'Marketing' },
      password: { value: '1234567890' },
    });
  }, [userId]);

  const UserComponent = isEdit ? EditUser : UserFormView;

  return (
    <UserFormContext.Provider value={{ fields: fields }}>
      <UserComponent />
    </UserFormContext.Provider>
  );
}

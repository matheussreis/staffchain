import EditUser from '../User/EditUser';
import { useEffect, useState } from 'react';
import useEditPageCheck from '../../hooks/use-edit-page-check';
import { UserFormContext } from '../../store/user-form-context';
import UserFormView from '../../components/UserForm/UserFormView';

export default function Me() {
  const isEdit = useEditPageCheck();

  const [fields, setFields] = useState({
    id: { value: '' },
    firstName: { value: '' },
    lastName: { value: '' },
    email: { value: '' },
    phone: { value: '' },
    birthdate: { value: '' },
    isAdministrator: { value: '' },
    departmentName: { value: '' },
    roleName: { value: '' },
  });

  useEffect(() => {
    if (fields.id.value !== '') {
      return;
    }

    // Call API using the user ID to fetch the user data.
    console.log(`USE USER DATA FROM API`);
    setFields({
      id: { value: '1000' },
      firstName: { value: 'John' },
      lastName: { value: 'Doe' },
      email: { value: 'johndoe@test.com' },
      phone: { value: '123321123' },
      birthdate: { value: '1997-01-01' },
      isAdministrator: { value: { label: 'Yes', value: '1' } },
      roleName: { value: 'Manager' },
      departmentName: { value: 'Marketing' },
    });
  }, [fields.id.value]);

  const UserComponent = isEdit ? EditUser : UserFormView;

  return (
    <UserFormContext.Provider value={{ fields: fields }}>
      <UserComponent />
    </UserFormContext.Provider>
  );
}

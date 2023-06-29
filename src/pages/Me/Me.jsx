import EditUser from '../User/EditUser';
import { useContext, useEffect, useState } from 'react';
import useEditPageCheck from '../../hooks/use-edit-page-check';
import { UserFormContext } from '../../store/user-form-context';
import UserFormView from '../../components/UserForm/UserFormView';
import { CurrentUserContext } from '../../store/current-user-context';

export default function Me() {
  const isEdit = useEditPageCheck();
  const { user } = useContext(CurrentUserContext);

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
    if (fields.id.value !== '' || !user.id) {
      return;
    }

    setFields({
      id: { value: user.id },
      firstName: { value: user.firstName },
      lastName: { value: user.lastName },
      email: { value: user.email },
      phone: { value: user.phone },
      birthdate: { value: user.bithdate },
      isAdministrator: {
        value: {
          label: user.isAdmin ? 'Yes' : 'No',
          value: user.isAdmin ? '1' : '0',
        },
      },
      roleName: { value: user.role },
      departmentName: { value: user.department },
    });
  }, [fields.id.value, user]);

  const UserComponent = isEdit ? EditUser : UserFormView;

  return (
    <UserFormContext.Provider value={{ fields: fields }}>
      <UserComponent />
    </UserFormContext.Provider>
  );
}

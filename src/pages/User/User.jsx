import EditUser from './EditUser';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import useEditPageCheck from '../../hooks/use-edit-page-check';
import { UserFormContext } from '../../store/user-form-context';
import UserFormView from '../../components/UserForm/UserFormView';

export default function User() {
  const location = useLocation();
  const { id: userId } = useParams();
  const isEdit = useEditPageCheck('user');

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
    password: { value: '' },
  });

  // Use this component as the parent of all user related views,
  // in other words, the parent of the view, edit and list views.
  // Then, add logic to fetch a list or a single user depending
  // on the URL. Lastly, add logic to select the component that
  // should be rendered. In case the URL is for list, then a list
  // of users should be rendered, in case the URL is for view, a
  // single user should be rendered.

  useEffect(() => {
    if (fields.id.value !== '') {
      return;
    }

    if (location.state) {
      // Don't call the API, and use the given state.
      console.log(`USER ID = ${userId} | USE USER DATA FROM STATE`);
      setFields({
        id: { value: location.state.id },
        firstName: { value: location.state.firstName },
        lastName: { value: location.state.lastName },
        email: { value: location.state.email },
        phone: { value: location.state.phone },
        birthdate: { value: location.state.birthdate },
        isAdministrator: { value: location.state.isAdministrator },
        roleName: { value: location.state.roleName },
        departmentName: { value: location.state.departmentName },
        password: { value: location.state.password },
      });
    } else {
      // Call API using the user ID to fetch the user data.
      console.log(`USER ID = ${userId} | USE USER DATA FROM API`);
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
        password: { value: '1234567890' },
      });
    }
  }, [userId, location.state, fields.id.value]);

  const UserComponent = isEdit ? EditUser : UserFormView;

  return (
    <UserFormContext.Provider value={{ fields: fields }}>
      <UserComponent />
    </UserFormContext.Provider>
  );
}

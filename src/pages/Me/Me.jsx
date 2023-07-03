import axios from 'axios';
import EditUser from '../User/EditUser';
import { useEffect, useState } from 'react';
import { json, useLoaderData } from 'react-router';
import useEditPageCheck from '../../hooks/use-edit-page-check';
import { UserFormContext } from '../../store/user-form-context';
import UserFormView from '../../components/UserForm/UserFormView';

export default function Me() {
  const isEdit = useEditPageCheck();
  const user = useLoaderData();

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
    if (!user) {
      return;
    }

    setFields({
      id: { value: user.id },
      firstName: { value: user.firstName },
      lastName: { value: user.lastName },
      email: { value: user.email },
      phone: { value: user.phone },
      birthdate: { value: user.birthdate },
      isAdministrator: {
        value: { ...user.isAdministrator },
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

const fetchCurrentUser = async () => {
  const { REACT_APP_SERVER_API_URL: API_URL } = process.env;
  const userResponse = await axios.get(`${API_URL}/user/me`);
  const user = userResponse.data;
  return user;
};

export async function loader() {
  try {
    const user = await fetchCurrentUser();

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      birthdate: user.birthdate,
      isAdministrator: {
        label: user.isAdmin ? 'Yes' : 'No',
        value: user.isAdmin ? '1' : '0',
      },
      role: user.role,
      department: user.department,
    };
  } catch (error) {
    throw json({
      title: 'Failure Fetching User',
      message: error.message,
    });
  }
}

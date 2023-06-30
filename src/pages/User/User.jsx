import axios from 'axios';
import EditUser from './EditUser';
import { useEffect, useState } from 'react';
import { json, useLoaderData, useLocation } from 'react-router';
import useEditPageCheck from '../../hooks/use-edit-page-check';
import { UserFormContext } from '../../store/user-form-context';
import UserFormView from '../../components/UserForm/UserFormView';

export default function User() {
  const isEdit = useEditPageCheck();
  const user = useLoaderData();
  const location = useLocation();

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
    if (location.state) {
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
      });

      return;
    }
    setFields(user);
  }, [location.state, user]);

  const UserComponent = isEdit ? EditUser : UserFormView;

  return (
    <UserFormContext.Provider value={{ fields: fields }}>
      <UserComponent />
    </UserFormContext.Provider>
  );
}

const fetchUser = async (id) => {
  const { REACT_APP_SERVER_API_URL: API_URL } = process.env;
  const userResponse = await axios.get(`${API_URL}/user/${id}`);
  const user = userResponse.data;
  return user;
};

export async function loader({ params }) {
  const userId = params.id;
  if (!userId) {
    throw json({
      title: 'User Not Found',
      message: 'The user you are looking for does not exist.',
    });
  }

  try {
    const userId = params.id;
    const user = await fetchUser(userId);

    return {
      id: { value: user.id },
      firstName: { value: user.firstName },
      lastName: { value: user.lastName },
      email: { value: user.email },
      phone: { value: user.phone },
      birthdate: { value: user.birthdate },
      isAdministrator: {
        value: {
          label: user.isAdmin ? 'Yes' : 'No',
          value: user.isAdmin ? '1' : '0',
        },
      },
      roleName: { value: user.role },
      departmentName: { value: user.department },
    };
  } catch (error) {
    if (error.response.status === 404) {
      throw json({
        title: error.response.data.title,
        message: error.response.data.message,
      });
    }

    throw json({
      title: 'User Not Found',
      message: error.message,
    });
  }
}

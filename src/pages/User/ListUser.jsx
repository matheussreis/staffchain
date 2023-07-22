import axios from 'axios';
import { useEffect, useState } from 'react';
import UserList from '../../components/UserList/UserList';
import { json, useLoaderData, useNavigate } from 'react-router';
import HeadPanel from '../../components/UI/HeadPanel/HeadPanel';
import NoListItems from '../../components/UI/NoListItems/NoListItems';

export default function ListUser() {
  const [users, setUsers] = useState([]);
  const usersData = useLoaderData();
  const navigate = useNavigate();

  useEffect(() => {
    if (users.length < 1) {
      setUsers(usersData);
    }
  }, [users, usersData]);

  return (
    <main>
      <HeadPanel
        moduleName="Users"
        recordCount={users.length}
        onClick={() => navigate('create')}
      />
      {users.length > 0 && <UserList users={users} />}
      {users.length < 1 && (
        <NoListItems
          title="No Users"
          message="There are no users to be displayed."
          isPageContent={true}
        />
      )}
    </main>
  );
}

const fetchUsers = async () => {
  const { REACT_APP_SERVER_API_URL: API_URL } = process.env;
  const userResponse = await axios.get(`${API_URL}/user`);
  const { users } = userResponse.data;
  return users;
};

export async function loader() {
  try {
    const users = await fetchUsers();
    const usersData = users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      birthdate: user.birthdate,
      email: user.email,
      isAdministrator: {
        label: user.isAdmin ? 'Yes' : 'No',
        value: user.isAdmin ? '1' : '0',
      },
      departmentName: user.department,
      roleName: user.role,
    }));

    return usersData;
  } catch (error) {
    throw json({
      title: 'Failure Fetching Users',
    });
  }
}

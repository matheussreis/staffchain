import axios from 'axios';
import { useEffect, useState } from 'react';
import UserList from '../../components/UserList/UserList';

export default function ListUser() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { REACT_APP_SERVER_API_URL: API_URL } = process.env;
      const userResponse = await axios.get(`${API_URL}/user`);
      const { users: usersData } = await userResponse.data;

      const users = usersData.map((user) => ({
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

      setUsers(users);
    };

    fetchUsers();
  }, []);

  return <UserList users={users} />;
}

import { useEffect, useState } from 'react';
import UserList from '../../components/UserList/UserList';

const DUMMY_USERS = [
  {
    id: '1000',
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@test.com',
    phone: '123321123',
    birthdate: '1997-01-01',
    isAdministrator: { label: 'Yes', value: '1' },
    departmentName: 'Marketing',
    roleName: 'Manager',
  },
  {
    id: '1001',
    firstName: 'Emma',
    lastName: 'Brown',
    email: 'emmabrown@test.com',
    phone: '321123321',
    birthdate: '1997-01-02',
    isAdministrator: { label: 'Yes', value: '1' },
    departmentName: 'Sales',
    roleName: 'Manager',
  },
  {
    id: '1002',
    firstName: 'Lucy',
    lastName: 'White',
    email: 'lucywhite@test.com',
    phone: '444333222',
    birthdate: '1997-01-03',
    isAdministrator: { label: 'Yes', value: '1' },
    departmentName: 'Development',
    roleName: 'Manager',
  },
];

export default function ListUser() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // call the API to fetch the list of users.
    console.log(`FETCH USERS LIST TO DISPLAY`);
    setUsers(DUMMY_USERS);
  }, []);

  return <UserList users={users} />;
}

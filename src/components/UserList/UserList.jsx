import List from '../UI/List/List';
import UserListItem from './UserListItem';
import HeadPanel from '../UI/HeadPanel/HeadPanel';

import classes from './UserList.module.css';
import { useNavigate } from 'react-router';

export default function UserList({ users = [] }) {
  const navigate = useNavigate();

  return (
    <main>
      <HeadPanel
        moduleName="Users"
        recordCount={users.length}
        onClick={() => navigate('create')}
      />
      <List className={classes.list}>
        {users.map((user) => (
          <UserListItem user={user} key={user.id} />
        ))}
      </List>
    </main>
  );
}

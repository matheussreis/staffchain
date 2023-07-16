import List from '../UI/List/List';
import UserListItem from './UserListItem';

import classes from './UserList.module.css';

export default function UserList({ users = [] }) {
  return (
    <List className={classes.list}>
      {users.map((user) => (
        <UserListItem user={user} key={user.id} />
      ))}
    </List>
  );
}

import Card from '../UI/Card/Card';
import { useNavigate } from 'react-router';
import FieldView from '../UI/FieldView/FieldView';
import ListItemHeader from '../UI/ListItem/ListItemHeader';
import ListItemControls from '../UI/ListItem/ListItemControls';

import classes from './UserListItem.module.css';

function ListItemContent({ user }) {
  return (
    <div className={classes['field-container']}>
      <FieldView
        className={classes.field}
        label="Department:"
        content={user.departmentName}
      />
      <FieldView
        className={classes.field}
        label="Role:"
        content={user.roleName}
      />
    </div>
  );
}

export default function UserListItem({ user }) {
  const navigate = useNavigate();

  return (
    <li className={classes.item}>
      <Card className={classes.container}>
        <div className={classes['content-container']}>
          <ListItemHeader
            title={`${user.firstName} ${user.lastName}`}
            sendTo={user.id}
            data={user}
          />
          <ListItemContent user={user} />
        </div>
        <ListItemControls onClick={() => navigate(user.id, { state: user })} />
      </Card>
    </li>
  );
}

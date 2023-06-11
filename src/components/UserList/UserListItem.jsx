import Card from '../UI/Card/Card';
import Anchor from '../UI/Anchor/Anchor';
import Button from '../UI/Button/Button';
import { useNavigate } from 'react-router';
import FieldView from '../UI/FieldView/FieldView';
import BUTTON_SIZES from '../../enums/button-sizes';

import classes from './UserListItem.module.css';

function ListItemHeader({ user }) {
  return (
    <Anchor className={classes['title-link']} to={user.id} state={user}>
      <h3 className={classes.title}>{`${user.firstName} ${user.lastName}`}</h3>
    </Anchor>
  );
}

function ListItemContent({ user }) {
  return (
    <div className={classes['field-container']}>
      <FieldView label="Department:" content={user.departmentName} />
      <FieldView label="Role:" content={user.roleName} />
    </div>
  );
}

function ListItemControls({ onClick }) {
  return (
    <div className={classes['content-container']}>
      <Button onClick={onClick} size={BUTTON_SIZES.SMALL} isAlt={false}>
        Open
      </Button>
    </div>
  );
}

export default function UserListItem({ user }) {
  const navigate = useNavigate();

  return (
    <li className={classes.item}>
      <Card className={classes.container}>
        <div className={classes['content-container']}>
          <ListItemHeader user={user} />
          <ListItemContent user={user} />
        </div>
        <ListItemControls onClick={() => navigate(user.id, { state: user })} />
      </Card>
    </li>
  );
}

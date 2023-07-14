import { useNavigate } from 'react-router-dom';
import Card from '../UI/Card/Card';
import FieldView from '../UI/FieldView/FieldView';
import ListItemControls from '../UI/ListItem/ListItemControls';
import ListItemHeader from '../UI/ListItem/ListItemHeader';

import classes from './AvailableProcessListItem.module.css';

function ListItemContent({ process }) {
  return (
    <div className={classes['field-container']}>
      <FieldView content={process.description} />
    </div>
  );
}

export default function AvailableProcessListItem({ process }) {
  const navigate = useNavigate();

  return (
    <li className={classes.item}>
      <Card className={classes.container}>
        <div className={classes['content-container']}>
          <ListItemHeader title={process.name} anchorDisabled />
          <ListItemContent process={process} />
        </div>
        <ListItemControls
          buttonName="Create"
          onClick={() =>
            navigate('/request/create', {
              state: {
                processId: process.id,
                name: process.name,
                description: process.description,
                fields: process.fields,
              },
            })
          }
        />
      </Card>
    </li>
  );
}

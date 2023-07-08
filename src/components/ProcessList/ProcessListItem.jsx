import Card from '../UI/Card/Card';
import { useNavigate } from 'react-router';
import FieldView from '../UI/FieldView/FieldView';
import ListItemHeader from '../UI/ListItem/ListItemHeader';
import ListItemControls from '../UI/ListItem/ListItemControls';

import classes from './ProcessListItem.module.css';

function ListItemContent({ process }) {
  return (
    <div className={classes['field-container']}>
      <FieldView content={process.step1.fields.description.value} />
    </div>
  );
}

export default function ProcessListItem({ process }) {
  const navigate = useNavigate();

  return (
    <li className={classes.item}>
      <Card className={classes.container}>
        <div className={classes['content-container']}>
          <ListItemHeader
            title={process.step1.fields.name.value}
            sendTo={process.id}
            data={process}
          />
          <ListItemContent process={process} />
        </div>
        <ListItemControls
          onClick={() => navigate(process.id, { state: { ...process } })}
        />
      </Card>
    </li>
  );
}

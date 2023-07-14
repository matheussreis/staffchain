import Card from '../UI/Card/Card';
import { Tag } from 'primereact/tag';
import { useNavigate } from 'react-router-dom';
import FieldView from '../UI/FieldView/FieldView';
import { translateEnum } from '../../enums/request-status';
import ListItemHeader from '../UI/ListItem/ListItemHeader';
import ListItemControls from '../UI/ListItem/ListItemControls';
import { getTagSeverityByRequestStatus } from '../../utils/enum-utils';

import classes from './RequestListItem.module.css';

const ListItemContent = ({ request }) => {
  return (
    <div className={classes['content-container']}>
      <FieldView content={request.description} />
      <div className={classes['field-container']}>
        <FieldView label="Starter:" content={request.starter.name} />
        <FieldView label="Reviewer:" content={request.reviewer.name} />
      </div>
    </div>
  );
};

export default function RequestListItem({ request }) {
  const navigate = useNavigate();

  return (
    <li className={classes.item}>
      <Card className={classes.container}>
        <div>
          <Tag
            value={translateEnum(request.status)}
            severity={getTagSeverityByRequestStatus(request.status)}
            className={classes.tag}
          />
          <ListItemHeader
            title={request.name}
            sendTo={`/request/${request.id}`}
          />
          <ListItemContent request={request} />
        </div>
        <ListItemControls onClick={() => navigate(`/request/${request.id}`)} />
      </Card>
    </li>
  );
}

import List from '../UI/List/List';
import RequestListItem from './RequestListItem';

import classes from './RequestList.module.css';

export default function RequestList({ requests = [] }) {
  return (
    <List className={classes.list}>
      {requests.map((request) => (
        <RequestListItem request={request} key={request.id} />
      ))}
    </List>
  );
}

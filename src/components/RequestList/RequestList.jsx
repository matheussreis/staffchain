import List from '../UI/List/List';
import { useNavigate } from 'react-router-dom';
import RequestListItem from './RequestListItem';
import HeadPanel from '../UI/HeadPanel/HeadPanel';

import classes from './RequestList.module.css';

export default function RequestList({ requests = [] }) {
  const navigate = useNavigate();

  return (
    <main>
      <HeadPanel
        moduleName="Requests"
        recordCount={requests.length}
        onClick={() => navigate('create')}
      />
      <List className={classes.list}>
        {requests.map((request) => (
          <RequestListItem request={request} key={request.id} />
        ))}
      </List>
    </main>
  );
}

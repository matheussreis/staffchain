import List from '../UI/List/List';
import { useNavigate } from 'react-router';
import ProcessListItem from './ProcessListItem';
import HeadPanel from '../UI/HeadPanel/HeadPanel';

import classes from './ProcessList.module.css';

export default function ProcessList({ processes = [] }) {
  const navigate = useNavigate();

  return (
    <main>
      <HeadPanel
        moduleName="Processes"
        recordCount={processes.length}
        onClick={() => navigate('create')}
      />
      <List className={classes.list}>
        {processes.map((process) => (
          <ProcessListItem process={process} key={process.id} />
        ))}
      </List>
    </main>
  );
}

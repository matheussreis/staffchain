import List from '../UI/List/List';
import HeadPanel from '../UI/HeadPanel/HeadPanel';
import AvailableProcessListItem from './AvailableProcessListItem';

import classes from './AvailableProcessList.module.css';

export default function AvailableProcessList({ processes = [] }) {
  return (
    <main>
      <HeadPanel
        moduleName="Available Processes"
        recordCount={processes.length}
        showButton={false}
      />
      <List className={classes.list}>
        {processes.map((process) => (
          <AvailableProcessListItem process={process} key={process.id} />
        ))}
      </List>
    </main>
  );
}

import List from '../UI/List/List';
import AvailableProcessListItem from './AvailableProcessListItem';

import classes from './AvailableProcessList.module.css';

export default function AvailableProcessList({ processes = [] }) {
  return (
    <List className={classes.list}>
      {processes.map((process) => (
        <AvailableProcessListItem process={process} key={process.id} />
      ))}
    </List>
  );
}

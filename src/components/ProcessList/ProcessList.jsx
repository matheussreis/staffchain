import List from '../UI/List/List';
import ProcessListItem from './ProcessListItem';

import classes from './ProcessList.module.css';

export default function ProcessList({ processes = [] }) {
  return (
    <List className={classes.list}>
      {processes.map((process) => (
        <ProcessListItem process={process} key={process.id} />
      ))}
    </List>
  );
}

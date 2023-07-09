export const REQUEST_STATUS = {
  'in-progress': 'In Progress',
  done: 'Done',
  'waiting-for-info': 'Waiting for Info',
  closed: 'Closed',
};

export function translateEnum(value) {
  for (const status in REQUEST_STATUS) {
    if (status === value) {
      return REQUEST_STATUS[status];
    }
  }

  return '';
}

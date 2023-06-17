import List from '../../UI/List/List';
import Button from '../../UI/Button/Button';
import { useContext, useEffect } from 'react';
import Container from '../../UI/Container/Container';
import { ProcessFormContext } from '../../../store/process-form-context';

import classes from './Step3.module.css';

function UserListItem({ user }) {
  return (
    <div className={classes['list-container']}>
      <p>{user.name}</p>

      <div className={classes.field}>
        <label>Role:</label>
        <p>{user.role}</p>
      </div>

      <div className={classes.field}>
        <label>Department:</label>
        <p>{user.department}</p>
      </div>
    </div>
  );
}

function SelectableUser({ user, onClick, isMoveBack = false }) {
  return (
    <li className={classes.item}>
      <UserListItem user={user} />
      <Button onClick={() => onClick(user)} className={classes.button}>
        {isMoveBack ? '<' : '>'}
      </Button>
    </li>
  );
}

export default function Step3() {
  const { step3, step4 } = useContext(ProcessFormContext);

  const moveUserToSelectedUsersList = (selectedUser) => {
    const newSystemUsers = step3.systemUsers.users.filter(
      (user) => user.id !== selectedUser.id
    );

    const processUsers = [
      {
        id: selectedUser.id,
        name: selectedUser.name,
        role: selectedUser.role,
        department: selectedUser.department,
      },
      ...step3.processUsers.users,
    ];

    step3.processUsers.setUsers([...processUsers]);
    step3.systemUsers.setUsers([...newSystemUsers]);

    setStep4AvailableUsers(processUsers);
  };

  const moveUserBackToUsersList = (selectedUser) => {
    const newProcessUsers = step3.processUsers.users.filter(
      (user) => user.id !== selectedUser.id
    );
    step3.systemUsers.setUsers([
      ...step3.systemUsers.users,
      {
        id: selectedUser.id,
        name: selectedUser.name,
        role: selectedUser.role,
        department: selectedUser.department,
      },
    ]);

    step3.processUsers.setUsers([...newProcessUsers]);

    setStep4AvailableUsers(newProcessUsers);
  };

  const setStep4AvailableUsers = (processUsers) => {
    const users = [];

    for (const user of processUsers) {
      if (!users.some((usr) => usr.id === user.id)) {
        users.push(user);
      }
    }

    step4.requestTree.setAvailableUsers(users);

    const selectedUserIds = Object.keys(step4.requestTree.selectedUsers);

    step4.requestTree.setSelectedUsers((prevState) => {
      const copy = { ...prevState };

      selectedUserIds.forEach((userId) => {
        if (!users.some((user) => user.id === userId)) {
          delete copy[userId];

          const reportees = Object.values(copy).filter(
            (user) => user.reportsTo.id === userId
          );

          reportees.forEach((reportee) => {
            reportee.reportsTo.id = null;
            reportee.reportsTo.name = null;
          });
        }
      });

      return copy;
    });
  };

  const filterSystemUsers = (step3) => {
    const processUsers = step3.processUsers.users;

    if (processUsers.length === 0) {
      return step3.systemUsers.users;
    }

    return step3.systemUsers.users.filter((user) => {
      return (
        processUsers.filter((processUser) => processUser.id === user.id)
          .length < 1
      );
    });
  };

  useEffect(() => {
    step3.setIsValid(step3.processUsers.users.length >= 2);
  }, [step3]);

  return (
    <Container className={classes.container}>
      {step3.systemUsers.users.length > 0 && (
        <List className={classes.list} scrollable>
          {filterSystemUsers(step3).map((user) => (
            <SelectableUser
              key={user.id}
              user={user}
              onClick={moveUserToSelectedUsersList}
            />
          ))}
        </List>
      )}
      {step3.processUsers.users.length > 0 && (
        <List className={classes.list} scrollable>
          {step3.processUsers.users.map((user) => (
            <SelectableUser
              key={user.id}
              user={user}
              onClick={moveUserBackToUsersList}
              isMoveBack={true}
            />
          ))}
        </List>
      )}
    </Container>
  );
}

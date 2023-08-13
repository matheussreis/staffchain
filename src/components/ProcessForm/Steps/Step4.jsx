import List from '../../UI/List/List';
import Select from '../../UI/Select/Select';
import useInput from '../../../hooks/use-input';
import Container from '../../UI/Container/Container';
import FIELD_TYPES from '../../../enums/field-types';
import { useContext, useEffect, useState } from 'react';
import { ProcessFormContext } from '../../../store/process-form-context';

import classes from './Step4.module.css';

function UserListItem({ user, availableUsers, onChangeReportsTo }) {
  const { step4 } = useContext(ProcessFormContext);

  const getDefaultValue = () => {
    const currentUser = step4.requestTree.selectedUsers[user.id];

    if (currentUser) {
      return availableUsers.find(
        (usr) => usr.value === currentUser.reportsTo.id
      );
    }

    return undefined;
  };

  const {
    value: reportsToValue,
    hasError: reportsToHasError,
    errorMessage: reportsToErrorMessage,
    selectValueChangeHandler: reportsToChangeHandler,
    inputBlurHandler: reportsToBlurHandler,
  } = useInput([FIELD_TYPES.TEXT, ['Reports To']], getDefaultValue());

  const selectChangeHandler = (option) => {
    onChangeReportsTo(option, user);
    reportsToChangeHandler(option);
    setIsStep4Valid(step4);
  };

  return (
    <li className={classes.container}>
      <div className={classes['field-container']}>
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
      <Select
        label="Reports To"
        name="reportsTo"
        options={availableUsers}
        className={classes.input}
        value={reportsToValue}
        onBlur={reportsToBlurHandler}
        onChange={selectChangeHandler}
        hasError={reportsToHasError}
        errorMessage={reportsToErrorMessage}
      />
    </li>
  );
}

function InfoText() {
  return (
    <div className={classes['info-container']}>
      <span className={classes.info}>
        To create the process, assign the reports-to of each user to the user
        who should send a request to their reporting user.
      </span>
      <span className={classes['info-secondary']}>
        NOTE: The process can only be created if there's one user who reports to
        himself. This user is the final approver in the request chain.
      </span>
    </div>
  );
}

const findReporteesByBossId = (selectedUsers, bossId) => {
  const reportees = [];

  for (const userId in selectedUsers) {
    const reporteeId = selectedUsers[userId].reportsTo.id;

    if (reporteeId === bossId && userId !== bossId) {
      reportees.push(userId);
    }
  }

  return reportees;
};

const getAvailableUsers = (currentUser, currentStep, rootUser) => {
  const availableUsers = currentStep.requestTree.availableUsers;
  let newAvailableUsers = [];

  if (rootUser !== null) {
    newAvailableUsers = availableUsers.filter(
      (availableUser) => availableUser.id !== currentUser.id
    );
  } else {
    newAvailableUsers = availableUsers;
  }

  let formattedList = newAvailableUsers.map((availableUser) => ({
    value: availableUser.id,
    label: availableUser.name,
  }));

  const reportees = findReporteesByBossId(
    currentStep.requestTree.selectedUsers,
    currentUser.id
  );

  formattedList = formattedList.filter(
    (user) => !reportees.includes(user.value)
  );

  return formattedList;
};

const findRootUser = (selectedUsers) => {
  for (const userId in selectedUsers) {
    const selectedUser = selectedUsers[userId];
    if (userId === selectedUser.reportsTo.id) {
      return selectedUser;
    }
  }

  return null;
};

const setIsStep4Valid = (step4) => {
  const { requestTree } = step4;

  const selectedUsers = Object.values(requestTree.selectedUsers);
  const availableUsers = requestTree.availableUsers;

  const usersInCommon = availableUsers.filter((availableUser) =>
    selectedUsers.some((selectedUser) => selectedUser.id === availableUser.id)
  );

  const isUserCountEqual = availableUsers.length === selectedUsers.length;
  const usersInCommonCount = usersInCommon.length;

  const rootUser = findRootUser(requestTree.selectedUsers);

  const isValid =
    isUserCountEqual &&
    usersInCommonCount === availableUsers.length &&
    !!rootUser;

  step4.setIsValid(isValid);
};

export default function Step4() {
  const { step4 } = useContext(ProcessFormContext);

  const [rootUser, setRootUser] = useState(null);

  const reportsToChangeHandler = (selectedUser, currentUser) => {
    const selectedUserId = selectedUser.value;
    const currentUserId = currentUser.id;

    if (currentUserId === selectedUserId) {
      setRootUser(currentUser);
    }

    if (
      rootUser &&
      currentUserId === rootUser.id &&
      currentUserId !== selectedUserId
    ) {
      setRootUser(null);
    }

    step4.requestTree.setSelectedUsers((prevState) => ({
      ...prevState,
      [currentUser.id]: {
        ...currentUser,
        reportsTo: {
          id: selectedUserId,
          name: selectedUser.label,
        },
      },
    }));
  };

  useEffect(() => {
    if (rootUser === null) {
      const user = findRootUser(step4.requestTree.selectedUsers);
      setRootUser(user);
    }
  }, [step4.requestTree.selectedUsers, rootUser]);

  useEffect(() => {
    setIsStep4Valid(step4);
  }, [step4]);

  return (
    <>
      <InfoText />
      <Container className={classes['list-container']}>
        {step4.requestTree.availableUsers.length > 0 && (
          <List className={classes.list} scrollable>
            {step4.requestTree.availableUsers.map((user) => (
              <UserListItem
                key={user.id}
                user={user}
                availableUsers={getAvailableUsers(user, step4, rootUser)}
                onChangeReportsTo={reportsToChangeHandler}
              />
            ))}
          </List>
        )}
      </Container>
    </>
  );
}

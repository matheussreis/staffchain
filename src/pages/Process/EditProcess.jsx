import { useContext, useState } from 'react';
import useInput from '../../hooks/use-input';
import FIELD_TYPES from '../../enums/field-types';
import { ProcessFormContext } from '../../store/process-form-context';
import ProcessForm from '../../components/ProcessForm/ProcessForm';

const DUMMY_USERS = [
  { id: 'u1', name: 'John Doe', role: 'CEO', department: 'Executive' },
  { id: 'u2', name: 'Lucy White', role: 'CTO', department: 'Executive' },
  { id: 'u3', name: 'Emma Brown', role: 'CFO', department: 'Executive' },
  {
    id: 'u4',
    name: 'Thomas Stone',
    role: 'Solutions Architect',
    department: 'Delivery',
  },
  {
    id: 'u5',
    name: 'Julia Gray',
    role: 'Junior Developer',
    department: 'Delivery',
  },
  { id: 'u6', name: 'Jimmy Storm', role: 'Developer', department: 'Delivery' },
];

export default function EditProcess() {
  const context = useContext(ProcessFormContext);
  const { fields } = context.step1;

  const {
    value: nameValue,
    isValid: nameIsValid,
    hasError: nameHasError,
    errorMessage: nameErrorMessage,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
  } = useInput([FIELD_TYPES.TEXT, ['Name']], fields.name.value);

  const {
    value: descriptionValue,
    isValid: descriptionIsValid,
    hasError: descriptionHasError,
    errorMessage: descriptionErrorMessage,
    valueChangeHandler: descriptionChangeHandler,
    inputBlurHandler: descriptionBlurHandler,
  } = useInput([FIELD_TYPES.TEXT, ['Description']], fields.description.value);

  const [processFields, setProcessFields] = useState(context.step2.processMetadata.fields || []);
  const [processUsers, setProcessUsers] = useState(context.step3.processUsers.users || []);
  const [requestTreeUsers, setRequestTreeUsers] = useState(context.step4.requestTree.selectedUsers || []);
  const [requestTreeAvailableUsers, setRequestTreeAvailableUsers] = useState(
    context.step4.requestTree.availableUsers || []
  );
  const [systemUsers, setSystemUsers] = useState(DUMMY_USERS);
  const [isStep1Valid, setIsStep1Valid] = useState(false);
  const [isStep2Valid, setIsStep2Valid] = useState(false);
  const [isStep3Valid, setIsStep3Valid] = useState(false);
  const [isStep4Valid, setIsStep4Valid] = useState(false);

  const providerValue = {
    step1: {
      fields: {
        name: {
          value: nameValue,
          isValid: nameIsValid,
          hasError: nameHasError,
          errorMessage: nameErrorMessage,
          valueChangeHandler: nameChangeHandler,
          inputBlurHandler: nameBlurHandler,
        },
        description: {
          value: descriptionValue,
          isValid: descriptionIsValid,
          hasError: descriptionHasError,
          errorMessage: descriptionErrorMessage,
          valueChangeHandler: descriptionChangeHandler,
          inputBlurHandler: descriptionBlurHandler,
        },
      },
      isValid: isStep1Valid,
      setIsValid: setIsStep1Valid,
    },
    step2: {
      processMetadata: {
        fields: processFields,
        setFields: setProcessFields,
      },
      isValid: isStep2Valid,
      setIsValid: setIsStep2Valid,
    },
    step3: {
      processUsers: {
        users: processUsers,
        setUsers: setProcessUsers,
      },
      systemUsers: {
        users: systemUsers,
        setUsers: setSystemUsers,
      },
      isValid: isStep3Valid,
      setIsValid: setIsStep3Valid,
    },
    step4: {
      requestTree: {
        selectedUsers: requestTreeUsers,
        setSelectedUsers: setRequestTreeUsers,
        availableUsers: requestTreeAvailableUsers,
        setAvailableUsers: setRequestTreeAvailableUsers,
      },
      isValid: isStep4Valid,
      setIsValid: setIsStep4Valid,
    },
  };

  return (
    <ProcessFormContext.Provider value={{ ...context, ...providerValue }}>
      <ProcessForm />
    </ProcessFormContext.Provider>
  );
}

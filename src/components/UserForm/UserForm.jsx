import axios from 'axios';
import Step1 from './Steps/Step1';
import Step2 from './Steps/Step2';
import { Toast } from 'primereact/toast';
import { useContext, useRef } from 'react';
import { useLocation } from 'react-router';
import MultiStepForm from '../UI/MultiStepForm/MultiStepForm';
import useMultiStepForm from '../../hooks/use-multi-step-form';
import useEditPageCheck from '../../hooks/use-edit-page-check';
import { UserFormContext } from '../../store/user-form-context';
import { CurrentUserContext } from '../../store/current-user-context';

export default function UserForm() {
  const { fields } = useContext(UserFormContext);
  const { user } = useContext(CurrentUserContext);
  let location = useLocation();
  const toastRef = useRef();

  const { steps, currentStep, goToNextStep, goToPreviousStep } =
    useMultiStepForm([Step1, Step2]);

  const isEdit = useEditPageCheck();

  let isFormValid = false;

  if (
    fields.firstName.isValid &&
    fields.lastName.isValid &&
    fields.phone.isValid &&
    fields.birthdate.isValid &&
    fields.email.isValid &&
    fields.isAdministrator.isValid &&
    fields.roleName.isValid &&
    fields.departmentName.isValid &&
    user.isAdmin &&
    !isEdit
      ? fields.password.isValid
      : true
  ) {
    isFormValid = true;
  }

  const submitFormHandler = async (event) => {
    event.preventDefault();

    if (!isFormValid) return;

    try {
      const { REACT_APP_SERVER_API_URL: API_URL } = process.env;
      let url = `${API_URL}/user/${isEdit ? fields.id.value : 'signup'}`;
      await axios(url, {
        data: {
          firstName: fields.firstName.value,
          lastName: fields.lastName.value,
          birthdate: fields.birthdate.value,
          email: fields.email.value,
          phone: fields.phone.value,
          department: fields.departmentName.value,
          role: fields.roleName.value,
          isAdmin: fields.isAdministrator.value.value === '1',
          password: fields.password.value,
        },
        method: isEdit ? 'PUT' : 'POST',
      });

      goToNextStep();
    } catch (error) {
      const operation = isEdit ? 'Updating' : 'Creating';
      toastRef.current.clear();
      toastRef.current.show({
        severity: 'error',
        summary: `Failure ${operation} User`,
        detail: error.message,
        sticky: true,
        style: { margin: '0.5rem' },
      });
    }
  };

  return (
    <>
      <Toast
        ref={toastRef}
        position="top-center"
        style={{ position: 'relative' }}
      />
      <MultiStepForm
        onSubmit={submitFormHandler}
        formTitle={`${isEdit ? 'Edit' : 'Create'} User`}
        lastButtonName={`${isEdit ? 'Save' : 'Create'}`}
        steps={steps}
        currentStep={currentStep}
        goToPreviousStep={goToPreviousStep}
        goToNextStep={goToNextStep}
        isCancelButton={true}
        cancelRedirect={isEdit ? location.pathname.replace('/edit', '') : -1}
        isFormValid={isFormValid}
      />
    </>
  );
}

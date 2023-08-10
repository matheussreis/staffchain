import axios from 'axios';
import Step1 from './Steps/Step1';
import Step2 from './Steps/Step2';
import { Toast } from 'primereact/toast';
import { useLocation } from 'react-router';
import { useContext, useEffect, useRef, useState } from 'react';
import MultiStepForm from '../UI/MultiStepForm/MultiStepForm';
import useMultiStepForm from '../../hooks/use-multi-step-form';
import useEditPageCheck from '../../hooks/use-edit-page-check';
import { UserFormContext } from '../../store/user-form-context';
import { CurrentUserContext } from '../../store/current-user-context';

export default function UserForm() {
  const { fields } = useContext(UserFormContext);
  const { user } = useContext(CurrentUserContext);
  const [isFormValid, setIsFormValid] = useState(false);
  let location = useLocation();
  const toastRef = useRef();

  const { steps, currentStep, goToNextStep, goToPreviousStep } =
    useMultiStepForm([Step1, Step2]);

  const isEdit = useEditPageCheck();

  useEffect(() => {
    setIsFormValid(
      fields.firstName.isValid &&
        fields.lastName.isValid &&
        fields.phone.isValid &&
        fields.birthdate.isValid &&
        fields.email.isValid &&
        fields.isAdministrator.isValid &&
        fields.roleName.isValid &&
        fields.departmentName.isValid &&
        (user.isAdmin && !isEdit ? fields.password.isValid : true)
    );
  }, [
    fields.birthdate.isValid,
    fields.departmentName.isValid,
    fields.email.isValid,
    fields.firstName.isValid,
    fields.isAdministrator.isValid,
    fields.lastName.isValid,
    fields.password.isValid,
    fields.phone.isValid,
    fields.roleName.isValid,
    isEdit,
    user.isAdmin,
  ]);

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

      let errorMessage = error.message;
      if (error.response?.status === 409) {
        errorMessage = error.response?.data?.message;
      }

      toastRef.current.clear();
      toastRef.current.show({
        severity: 'error',
        summary: `Failure ${operation} User`,
        detail: errorMessage,
        sticky: true,
      });
    }
  };

  return (
    <>
      <Toast ref={toastRef} position="top-center" />
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

import { useContext } from 'react';
import Step1 from './Steps/Step1';
import Step2 from './Steps/Step2';
import { useLocation } from 'react-router';
import MultiStepForm from '../UI/MultiStepForm/MultiStepForm';
import useMultiStepForm from '../../hooks/use-multi-step-form';
import useEditPageCheck from '../../hooks/use-edit-page-check';
import { UserFormContext } from '../../store/user-form-context';
import { CurrentUserContext } from '../../store/current-user-context';

export default function UserForm() {
  const { user } = useContext(CurrentUserContext);
  const { fields } = useContext(UserFormContext);
  let location = useLocation();

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

  const submitFormHandler = (formData) => {
    console.log(formData);

    // When calling the API to save the user data, check if the current
    // form is being used to edit or create. If the form is being used
    // to edit, send a PUT request with the user data, otherwise, if
    // the form is being used to create, send a POST request with the
    // user data.

    return (event) => {
      event.preventDefault();
      console.log('Submit Form');
      goToNextStep();
    };
  };

  return (
    <MultiStepForm
      onSubmit={submitFormHandler(fields)}
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
  );
}

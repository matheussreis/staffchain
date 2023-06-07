import { useContext } from 'react';
import Step1 from './Steps/Step1';
import Step2 from './Steps/Step2';
import MultiStepForm from '../UI/MultiStepForm/MultiStepForm';
import useMultiStepForm from '../../hooks/use-multi-step-form';
import { UserFormContext } from '../../store/user-form-context';
import useEditPageCheck from '../../hooks/use-edit-page-check';
import { useLocation } from 'react-router';

export default function UserForm() {
  const context = useContext(UserFormContext);
  let location = useLocation();

  const { steps, currentStep, goToNextStep, goToPreviousStep } =
    useMultiStepForm([Step1, Step2]);

  const isEdit = useEditPageCheck('user');

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
      onSubmit={submitFormHandler(context.fields)}
      formTitle={`${isEdit ? 'Edit' : 'Create'} User`}
      lastButtonName={`${isEdit ? 'Save' : 'Create'}`}
      steps={steps}
      currentStep={currentStep}
      goToPreviousStep={goToPreviousStep}
      goToNextStep={goToNextStep}
      isCancelButton={isEdit}
      cancelRedirect={isEdit ? location.pathname.replace('/edit', '') : null}
      isFormValid={
        context.fields.firstName.isValid &&
        context.fields.lastName.isValid &&
        context.fields.phone.isValid &&
        context.fields.birthdate.isValid &&
        context.fields.email.isValid &&
        context.fields.isAdministrator.isValid &&
        context.fields.departmentName.isValid &&
        context.fields.password.isValid
      }
    />
  );
}

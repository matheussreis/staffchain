import Step1 from './Steps/Step1';
import Step2 from './Steps/Step2';
import Step3 from './Steps/Step3';
import Step4 from './Steps/Step4';
import Step5 from './Steps/Step5';
import { useContext } from 'react';
import { useLocation } from 'react-router';
import MultiStepForm from '../UI/MultiStepForm/MultiStepForm';
import useMultiStepForm from '../../hooks/use-multi-step-form';
import useEditPageCheck from '../../hooks/use-edit-page-check';
import { ProcessFormContext } from '../../store/process-form-context';

const getCurrentStepFormValidity = (context, step) => {
  const stepNumber = step + 1;
  const currentStep = context[`step${stepNumber}`];

  if (currentStep) {
    return currentStep.isValid;
  }

  return false;
};

export default function ProcessForm() {
  const { steps, currentStep, goToNextStep, goToPreviousStep } =
    useMultiStepForm([Step1, Step2, Step3, Step4, Step5]);

  let location = useLocation();
  const isEdit = useEditPageCheck();
  const context = useContext(ProcessFormContext);

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
      onSubmit={submitFormHandler(context)}
      formTitle={`${isEdit ? 'Edit' : 'Create'} Process`}
      lastButtonName={`${isEdit ? 'Save' : 'Create'}`}
      steps={steps}
      currentStep={currentStep}
      goToPreviousStep={goToPreviousStep}
      goToNextStep={goToNextStep}
      isFormValid={getCurrentStepFormValidity(context, currentStep)}
      isCancelButton={true}
      cancelRedirect={isEdit ? location.pathname.replace('/edit', '') : -1}
    />
  );
}

import Step1 from './Steps/Step1';
import Step2 from './Steps/Step2';
import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import MultiStepForm from '../UI/MultiStepForm/MultiStepForm';
import useEditPageCheck from '../../hooks/use-edit-page-check';
import useMultiStepForm from '../../hooks/use-multi-step-form';
import { RequestFormContext } from '../../store/request-form-context';

export default function RequestForm() {
  const { steps, currentStep, goToNextStep, goToPreviousStep } =
    useMultiStepForm([Step1, Step2]);

  let location = useLocation();
  const isEdit = useEditPageCheck();
  const { request } = useContext(RequestFormContext);

  const submitFormHandler = (request) => {
    console.log(request);

    return (event) => {
      event.preventDefault();
      console.log('Submit Form');
      goToNextStep();
    };
  };

  return (
    <MultiStepForm
      onSubmit={submitFormHandler(request)}
      formTitle={`${isEdit ? 'Edit' : 'Create'} Request`}
      lastButtonName={`${isEdit ? 'Save' : 'Create'}`}
      steps={steps}
      currentStep={currentStep}
      goToPreviousStep={goToPreviousStep}
      goToNextStep={goToNextStep}
      isCancelButton={true}
      cancelRedirect={-isEdit ? location.pathname.replace('/edit', '') : -1}
      isFormValid={request.isValid}
    />
  );
}

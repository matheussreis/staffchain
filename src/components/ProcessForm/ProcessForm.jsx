import axios from 'axios';
import Step1 from './Steps/Step1';
import Step2 from './Steps/Step2';
import Step3 from './Steps/Step3';
import Step4 from './Steps/Step4';
import Step5 from './Steps/Step5';
import { Toast } from 'primereact/toast';
import { useContext, useRef } from 'react';
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

  const toastRef = useRef();
  let location = useLocation();
  const isEdit = useEditPageCheck();
  const context = useContext(ProcessFormContext);

  const submitFormHandler = async (event) => {
    event.preventDefault();

    try {
      const { REACT_APP_SERVER_API_URL: API_URL } = process.env;
      let url = `${API_URL}/process/${context.id}`;
      await axios(url, {
        data: {
          name: context.step1.fields.name.value,
          description: context.step1.fields.description.value,
          fieldSet: context.step2.processMetadata.fields.map((field) => ({
            id: field.id,
            label: field.name,
            type: field.type.value,
            required: field.required.value === '1',
          })),
          requestTree: Object.values(
            context.step4.requestTree.selectedUsers
          ).map((requestNode) => ({
            userId: requestNode.id,
            reportsTo: requestNode.reportsTo.id,
          })),
        },
        method: isEdit ? 'PUT' : 'POST',
      });

      goToNextStep();
    } catch (error) {
      const operation = isEdit ? 'Updating' : 'Creating';
      toastRef.current.clear();
      toastRef.current.show({
        severity: 'error',
        summary: `Failure ${operation} Process`,
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
    </>
  );
}

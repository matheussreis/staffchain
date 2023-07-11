import axios from 'axios';
import Step1 from './Steps/Step1';
import Step2 from './Steps/Step2';
import { useContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import MultiStepForm from '../UI/MultiStepForm/MultiStepForm';
import useMultiStepForm from '../../hooks/use-multi-step-form';
import { RequestFormContext } from '../../store/request-form-context';
import { Toast } from 'primereact/toast';

export default function RequestForm() {
  const { steps, currentStep, goToNextStep, goToPreviousStep } =
    useMultiStepForm([Step1, Step2]);

  const toastRef = useRef();
  let location = useLocation();
  const { request } = useContext(RequestFormContext);

  const submitFormHandler = async (event) => {
    event.preventDefault();

    try {
      const { REACT_APP_SERVER_API_URL: API_URL } = process.env;
      const url = `${API_URL}/request/${request.id}/fields`;

      const formData = new FormData();
      request.fields.forEach((field) => {
        formData.append(field.id, field.value || '');
      });

      await axios.put(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      goToNextStep();
    } catch (error) {
      toastRef.current.clear();
      toastRef.current.show({
        severity: 'error',
        summary: 'Failure Updating Process',
        detail: error.message,
        sticky: true,
        style: { margin: '0.5rem' },
      });
    }
  };

  return (
    <>
      <Toast ref={toastRef} position="top-center" />
      <MultiStepForm
        onSubmit={submitFormHandler}
        formTitle="Edit Request"
        lastButtonName="Save"
        steps={steps}
        currentStep={currentStep}
        goToPreviousStep={goToPreviousStep}
        goToNextStep={goToNextStep}
        isCancelButton={true}
        cancelRedirect={location.pathname.replace('/edit', '')}
        isFormValid={request.isValid}
      />
    </>
  );
}

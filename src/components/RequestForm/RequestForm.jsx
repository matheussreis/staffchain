import axios from 'axios';
import Step1 from './Steps/Step1';
import Step2 from './Steps/Step2';
import { Toast } from 'primereact/toast';
import { useContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import MultiStepForm from '../UI/MultiStepForm/MultiStepForm';
import useMultiStepForm from '../../hooks/use-multi-step-form';
import useEditPageCheck from '../../hooks/use-edit-page-check';
import { RequestFormContext } from '../../store/request-form-context';

const { REACT_APP_SERVER_API_URL: API_URL } = process.env;

const updateRequest = async (id, fields) => {
  const url = `${API_URL}/request/${id}/fields`;

  const formData = new FormData();
  fields.forEach((field) => {
    formData.append(field.id, field.value || '');
  });

  return axios.put(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const addRequest = async (processId, fields) => {
  const url = `${API_URL}/request/${processId}`;

  const formData = new FormData();
  fields.forEach((field) => {
    formData.append(field.id, field.value || '');
  });

  return axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export default function RequestForm() {
  const { steps, currentStep, goToNextStep, goToPreviousStep } =
    useMultiStepForm([Step1, Step2]);

  const toastRef = useRef();
  let location = useLocation();
  const isEdit = useEditPageCheck();
  const { request } = useContext(RequestFormContext);

  const submitFormHandler = async (event) => {
    event.preventDefault();

    try {
      if (isEdit) {
        await updateRequest(request.id, request.fields);
      } else {
        await addRequest(request.processId, request.fields);
      }

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
      <Toast ref={toastRef} position="top-center" />
      <MultiStepForm
        onSubmit={submitFormHandler}
        formTitle={`${isEdit ? 'Edit' : 'Create'} Request`}
        lastButtonName={`${isEdit ? 'Save' : 'Create'}`}
        steps={steps}
        currentStep={currentStep}
        goToPreviousStep={goToPreviousStep}
        goToNextStep={goToNextStep}
        isCancelButton={true}
        cancelRedirect={isEdit ? location.pathname.replace('/edit', '') : -1}
        isFormValid={request.isValid}
      />
    </>
  );
}

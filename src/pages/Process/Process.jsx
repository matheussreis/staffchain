import EditProcess from './EditProcess';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import useEditPageCheck from '../../hooks/use-edit-page-check';
import { ProcessFormContext } from '../../store/process-form-context';
import ProcessFormView from '../../components/ProcessForm/ProcessFormView';
import { json, useLoaderData } from 'react-router';
import axios from 'axios';
import { translateOption } from '../../options/field-types-dom';

export default function Process() {
  const location = useLocation();
  const processData = useLoaderData();
  const isEdit = useEditPageCheck();

  const [id, setId] = useState('');
  const [step1, setStep1] = useState({
    fields: {
      name: { value: '' },
      description: { value: '' },
    },
  });
  const [step2, setStep2] = useState({ processMetadata: { fields: [] } });
  const [step3, setStep3] = useState({ processUsers: { users: [] } });
  const [step4, setStep4] = useState({
    requestTree: { availableUsers: [], selectedUsers: {} },
  });

  const ProcessComponent = isEdit ? EditProcess : ProcessFormView;

  useEffect(() => {
    if (location.state) {
      setId(location.state.id);
      setStep1(location.state.step1);
      setStep2(location.state.step2);
      setStep3(location.state.step3);
      setStep4(location.state.step4);
      return;
    }

    setId(processData.id);
    setStep1(processData.step1);
    setStep2(processData.step2);
    setStep3(processData.step3);
    setStep4(processData.step4);
  }, [id, location.state, processData]);

  return (
    <ProcessFormContext.Provider
      value={{
        id: id,
        step1: step1,
        step2: step2,
        step3: step3,
        step4: step4,
      }}
    >
      <ProcessComponent />
    </ProcessFormContext.Provider>
  );
}

const fetchProcess = async (id) => {
  const { REACT_APP_SERVER_API_URL: API_URL } = process.env;
  const processResponse = await axios.get(`${API_URL}/process/${id}`);
  const processData = processResponse.data;
  return processData;
};

export async function loader({ params }) {
  const processId = params.id;
  if (!processId) {
    throw json({
      title: 'Process Not Found',
      message: 'The process you are looking for does not exist.',
    });
  }

  try {
    const process = await fetchProcess(processId);

    return {
      id: process.id,
      step1: {
        fields: {
          name: { value: process.name },
          description: {
            value: process.description,
          },
        },
      },
      step2: {
        processMetadata: {
          fields: process.fieldSet.map((field) => ({
            id: field.id,
            name: field.label,
            required: {
              label: field.required ? 'Yes' : 'No',
              value: field.required ? '1' : '0',
            },
            type: {
              label: translateOption(field.type),
              value: field.type,
            },
          })),
        },
      },
      step3: {
        processUsers: {
          users: [...process.requestTree],
        },
      },
      step4: {
        requestTree: {
          availableUsers: [...process.requestTree],
          selectedUsers: {
            ...process.requestTree.reduce(
              (result, currentObject) => ({
                ...result,
                [currentObject.id]: { ...currentObject },
              }),
              {}
            ),
          },
        },
      },
    };
  } catch (error) {
    if (error.response.status === 404) {
      throw json({
        title: error.response.data.title,
        message: error.response.data.message,
      });
    }

    throw json({
      title: 'Process Not Found',
      message: error.message,
    });
  }
}

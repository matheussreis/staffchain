import axios from 'axios';
import { useEffect, useState } from 'react';
import { json, useLoaderData } from 'react-router-dom';
import { translateOption } from '../../options/field-types-dom';
import ProcessList from '../../components/ProcessList/ProcessList';

export default function ListProcess() {
  const [processes, setProcesses] = useState([]);
  const processData = useLoaderData();

  useEffect(() => {
    // call the API to fetch the list of processes.
    console.log(`FETCH PROCESSES LIST TO DISPLAY`);
    setProcesses(processData);
  }, [processData]);

  return <ProcessList processes={processes} />;
}

const fetchProcesses = async () => {
  const { REACT_APP_SERVER_API_URL: API_URL } = process.env;
  const processResponse = await axios.get(`${API_URL}/process`);
  const { processes } = processResponse.data;
  return processes;
};

export async function loader() {
  try {
    const processes = await fetchProcesses();
    const processesData = processes.map((process) => ({
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
    }));

    return processesData;
  } catch (error) {
    throw json({
      title: 'Failure Fetching Processes',
    });
  }
}

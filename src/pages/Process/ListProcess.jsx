import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { translateOption } from '../../options/field-types-dom';
import HeadPanel from '../../components/UI/HeadPanel/HeadPanel';
import ProcessList from '../../components/ProcessList/ProcessList';
import { json, useLoaderData, useNavigate } from 'react-router-dom';
import { CurrentUserContext } from '../../store/current-user-context';
import NoListItems from '../../components/UI/NoListItems/NoListItems';

export default function ListProcess() {
  const [processes, setProcesses] = useState([]);
  const processData = useLoaderData();
  const navigate = useNavigate();
  const { user } = useContext(CurrentUserContext);

  useEffect(() => {
    setProcesses(processData);
  }, [processData]);

  return (
    <main>
      <HeadPanel
        moduleName="Processes"
        recordCount={processes.length}
        onClick={() => navigate('create')}
        showButton={user.isAdmin}
      />
      {processes.length > 0 && <ProcessList processes={processes} />}
      {processes.length < 1 && (
        <NoListItems
          title="No Processes"
          message="There are no processes to be displayed."
          isPageContent={true}
        />
      )}
    </main>
  );
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

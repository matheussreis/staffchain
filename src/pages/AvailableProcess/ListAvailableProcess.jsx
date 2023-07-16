import axios from 'axios';
import { useEffect, useState } from 'react';
import { json, useLoaderData } from 'react-router-dom';
import HeadPanel from '../../components/UI/HeadPanel/HeadPanel';
import AvailableProcessList from '../../components/AvailableProcessList/AvailableProcessList';

export default function ListAvailableProcess() {
  const [processes, setProcesses] = useState([]);
  const processData = useLoaderData();

  useEffect(() => {
    setProcesses(processData);
  }, [processData]);

  return (
    <main>
      <HeadPanel
        moduleName="Available Processes"
        recordCount={processes.length}
        showButton={false}
      />
      <AvailableProcessList processes={processes} />
    </main>
  );
}

const fetchAvailableProcesses = async () => {
  const { REACT_APP_SERVER_API_URL: API_URL } = process.env;
  const processesResponse = await axios.get(`${API_URL}/user/processes`);
  const { processes } = processesResponse.data;
  return processes;
};

export async function loader() {
  try {
    const processesData = await fetchAvailableProcesses();

    const processes = processesData.map((process) => ({
      id: process.id,
      name: process.name,
      description: process.description,
      fields: process.fields.map((field) => ({
        id: field.id,
        name: field.label,
        required: field.required,
        type: field.type,
        value: undefined,
      })),
    }));

    return processes;
  } catch (error) {
    throw json({
      title: 'Failure Fetching Available Processes',
      message: error.message,
    });
  }
}

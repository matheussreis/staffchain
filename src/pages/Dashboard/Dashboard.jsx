import axios from 'axios';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { getAuthToken } from '../../utils/auth-utils';
import Container from '../../components/UI/Container/Container';
import RequestList from '../../components/RequestList/RequestList';
import NoListItems from '../../components/UI/NoListItems/NoListItems';
import DashboardPanel from '../../components/DashboardPanel/DashboardPanel';
import AvailableProcessList from '../../components/AvailableProcessList/AvailableProcessList';

export default function Dashboard() {
  const toastRef = useRef();

  const [data, setData] = useState({
    availableProcesses: [],
    requestsToReview: [],
    startedRequests: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    const setValues = async () => {
      const results = await fetchDashboardData();
      setData(results);
    };

    try {
      const token = getAuthToken();
      if (token && token !== 'EXPIRED') {
        setValues();
      }
    } catch (error) {
      toastRef.current.clear();
      toastRef.current.show({
        severity: 'error',
        summary: 'Data Fetch Failure',
        detail: error.message,
        sticky: true,
      });
    }
  }, []);

  return (
    <>
      <Toast ref={toastRef} position="top-center" />
      <Container>
        <DashboardPanel
          title="Started Requests"
          onViewMoreClick={() => navigate('request/started')}
        >
          {data.startedRequests.length > 0 && (
            <RequestList requests={data.startedRequests} />
          )}
          {data.startedRequests.length < 1 && (
            <NoListItems
              title="No Started Requests"
              message="You have no started requests at the moment."
            />
          )}
        </DashboardPanel>
        <DashboardPanel
          title="Available Processes"
          onViewMoreClick={() => navigate('process/available')}
        >
          {data.availableProcesses.length > 0 && (
            <AvailableProcessList processes={data.availableProcesses} />
          )}
          {data.availableProcesses.length < 1 && (
            <NoListItems
              title="No Available Processes"
              message="You have no available processes at the moment."
            />
          )}
        </DashboardPanel>
        <DashboardPanel
          title="Requests to Review"
          onViewMoreClick={() => navigate('request/to-review')}
        >
          {data.requestsToReview.length > 0 && (
            <RequestList requests={data.requestsToReview} />
          )}
          {data.requestsToReview.length < 1 && (
            <NoListItems
              title="No Requests to Review"
              message="You have no requests to review at the moment."
            />
          )}
        </DashboardPanel>
      </Container>
    </>
  );
}

const { REACT_APP_SERVER_API_URL: API_URL } = process.env;

const fetchAvailableProcesses = async () => {
  const processResponse = await axios.get(`${API_URL}/user/processes`, {
    params: { limit: 5 },
  });

  const { processes } = processResponse.data;
  return processes;
};

const fetchRequestsToReview = async () => {
  const requestResponse = await axios.get(
    `${API_URL}/user/requests-to-review`,
    { params: { limit: 5 } }
  );

  const { requests } = requestResponse.data;
  return requests;
};

const fetchStartedRequests = async () => {
  const requestResponse = await axios.get(`${API_URL}/user/started-requests`, {
    params: { limit: 3 },
  });

  const { requests } = requestResponse.data;
  return requests;
};

const fetchDashboardData = async () => {
  const responsesData = await Promise.all([
    fetchAvailableProcesses(),
    fetchRequestsToReview(),
    fetchStartedRequests(),
  ]);

  const responses = {
    availableProcesses: [...responsesData[0]],
    requestsToReview: [...responsesData[1]],
    startedRequests: [...responsesData[2]],
  };

  for (const response in responses) {
    responses[response] = responses[response].map((data) => ({
      id: data?.id,
      name: data?.name,
      description: data?.description,
      fields: data.fields
        ? data.fields.map((field) => ({
            id: field.id,
            name: field.label,
            required: field.required,
            type: field.type,
            value: field.value,
          }))
        : [],
      status: data?.status,
      starter: data?.starter,
      reviewer: data?.reviewer,
    }));
  }

  return responses;
};

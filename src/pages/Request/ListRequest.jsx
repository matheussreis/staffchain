import axios from 'axios';
import { useEffect, useState } from 'react';
import { json, useLoaderData, useLocation } from 'react-router-dom';
import RequestList from '../../components/RequestList/RequestList';

export default function ListRequest() {
  const [requests, setRequests] = useState([]);
  const requestData = useLoaderData();
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/request/started':
        return 'Started Requests';
      case '/request/to-review':
        return 'Requests to Review';
      default:
        return 'Requests';
    }
  };

  useEffect(() => {
    setRequests(requestData);
  }, [requestData]);

  return <RequestList title={getPageTitle()} requests={requests} />;
}

const getApiUrl = (pageUrl) => {
  const { REACT_APP_SERVER_API_URL: API_URL } = process.env;
  const path = new URL(pageUrl).pathname;

  switch (path) {
    case '/request/started':
      return `${API_URL}/user/started-requests`;
    case '/request/to-review':
      return `${API_URL}/user/requests-to-review`;
    default:
      return `${API_URL}/request`;
  }
};

const fetchRequests = async (apiUrl) => {
  const requestResponse = await axios.get(apiUrl);
  const { requests } = requestResponse.data;
  return requests;
};

export async function loader({ request }) {
  try {
    debugger;

    const apiUrl = getApiUrl(request.url);
    const requests = await fetchRequests(apiUrl);
    const requestsData = requests.map((requestData) => ({
      id: requestData.id,
      name: requestData.name,
      processId: requestData.processId,
      description: requestData.description,
      fields: requestData.fields
        ? requestData.fields.map((field) => ({
            id: field.id,
            name: field.label,
            required: field.required,
            type: field.type,
            value: field.value,
          }))
        : [],
      status: requestData.status,
      comments: requestData.comments,
      starter: requestData.starter,
      reviewer: requestData.reviewer,
    }));

    return requestsData;
  } catch (error) {
    throw json({
      title: 'Failure Fetching Requests',
      message: error.message,
    });
  }
}

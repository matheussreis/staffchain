import axios from 'axios';
import { useEffect, useState } from 'react';
import { json, useLoaderData } from 'react-router-dom';
import RequestList from '../../components/RequestList/RequestList';

export default function ListRequest() {
  const [requests, setRequests] = useState([]);
  const requestData = useLoaderData();

  useEffect(() => {
    console.log(`FETCH REQUEST LIST TO DISPLAY`);
    setRequests(requestData);
  }, [requestData]);

  return <RequestList requests={requests} />;
}

const fetchRequests = async () => {
  const { REACT_APP_SERVER_API_URL: API_URL } = process.env;
  const requestResponse = await axios.get(`${API_URL}/request`);
  const { requests } = requestResponse.data;
  return requests;
};

export async function loader() {
  try {
    const requests = await fetchRequests();
    const requestsData = requests.map((request) => ({
      id: request.id,
      name: request.name,
      description: request.description,
      fields: request.fields,
      status: request.status,
      comments: request.comments,
      starter: request.starter,
      reviewer: request.reviewer,
    }));

    return requestsData;
  } catch (error) {
    throw json({
      title: 'Failure Fetching Requests',
    });
  }
}

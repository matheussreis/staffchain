import axios from 'axios';
import EditRequest from './EditRequest';
import { useEffect, useState } from 'react';
import { json, useLoaderData, useLocation } from 'react-router-dom';
import useEditPageCheck from '../../hooks/use-edit-page-check';
import { RequestFormContext } from '../../store/request-form-context';
import RequestFormView from '../../components/RequestForm/RequestFormView';

export default function Request() {
  const isEdit = useEditPageCheck();
  const requestData = useLoaderData();

  const location = useLocation();

  const [comments, setComments] = useState([]);
  const [metadata, setMetadata] = useState({
    id: '',
    name: '',
    fields: [],
    status: '',
    starter: { id: '', name: '' },
    reviewer: { id: '', name: '' },
  });

  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (location.state) {
      setMetadata({
        id: location.state.id,
        name: location.state.name,
        description: location.state.description,
        fields: location.state.fields,
        status: location.state.status,
        starter: location.state.starter,
        reviewer: location.state.reviewer,
      });
      setComments(location.state.comments);
    } else {
      setMetadata({
        id: requestData.id,
        name: requestData.name,
        description: requestData.description,
        fields: requestData.fields,
        status: requestData.status,
        starter: requestData.starter,
        reviewer: requestData.reviewer,
      });

      setComments(requestData.comments);
    }
  }, [location.state, requestData]);

  const RequestComponent = isEdit ? EditRequest : RequestFormView;

  return (
    <RequestFormContext.Provider
      value={{
        request: {
          ...metadata,
          comments: comments,
          updateComments: setComments,
          isValid: isValid,
          setIsValid: setIsValid,
        },
      }}
    >
      <RequestComponent />
    </RequestFormContext.Provider>
  );
}

const fetchRequest = async (id) => {
  const { REACT_APP_SERVER_API_URL: API_URL } = process.env;
  const requestResponse = await axios.get(`${API_URL}/request/${id}`);
  const requestData = requestResponse.data;
  return requestData;
};

export async function loader({ params }) {
  const requestId = params.id;
  if (!requestId) {
    throw json({
      title: 'Request Not Found',
      message: 'The request you are looking for does not exist.',
    });
  }

  try {
    const request = await fetchRequest(requestId);

    return {
      id: request.id,
      name: request.name,
      description: request.description,
      fields: request.fields.map((field) => ({
        id: field.id,
        name: field.label,
        required: field.required,
        type: field.type,
        value: field.value,
      })),
      status: request.status,
      starter: request.starter,
      reviewer: request.reviewer,
      comments: request.comments,
    };
  } catch (error) {
    if (error.response.status === 404) {
      throw json({
        title: error.response.data.title,
        message: error.response.data.message,
      });
    }

    throw json({
      title: 'Request Not Found',
      message: error.message,
    });
  }
}

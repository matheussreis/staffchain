import { useContext, useState } from 'react';
import RequestForm from '../../components/RequestForm/RequestForm';
import { RequestFormContext } from '../../store/request-form-context';

export default function EditRequest() {
  const context = useContext(RequestFormContext);
  const request = context.request;

  const [comments, setComments] = useState(request.comments || []);
  const [isValid, setIsValid] = useState(request.isValid || true);
  const [metadata, setMetadata] = useState({
    id: request.id || '',
    name: request.name || '',
    fields: request.fields || [],
    status: request.status || '',
    starter: request.starter || { id: '', name: '' },
    reviewer: request.reviewer || { id: '', name: '' },
  });

  const providerValue = {
    request: {
      ...metadata,
      updateMetadata: setMetadata,
      comments: comments,
      updateComments: setComments,
      isValid: isValid,
      setIsValid: setIsValid,
    },
  };

  return (
    <RequestFormContext.Provider value={{ ...context, ...providerValue }}>
      <RequestForm />
    </RequestFormContext.Provider>
  );
}

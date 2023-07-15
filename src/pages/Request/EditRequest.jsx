import { useLocation } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import RequestForm from '../../components/RequestForm/RequestForm';
import { RequestFormContext } from '../../store/request-form-context';

export default function EditRequest() {
  const context = useContext(RequestFormContext);
  const request = context.request;
  const location = useLocation();

  const [comments, setComments] = useState(request.comments || []);
  const [isValid, setIsValid] = useState(request.isValid || true);
  const [metadata, setMetadata] = useState({
    id: request.id || '',
    name: request.name || '',
    fields: request.fields || [],
    description: request.description || '',
    processId: request.processId || '',
    status: request.status || '',
    timeline: request.timeline || [],
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

  useEffect(() => {
    if (location.state) {
      setMetadata({
        id: location.state.id,
        name: location.state.name,
        description: location.state.description,
        processId: location.state.processId,
        fields: location.state.fields,
        status: location.state.status,
        starter: location.state.starter,
        reviewer: location.state.reviewer,
        timeline: location.state.timeline,
      });

      setComments(location.state.comments || []);
    }
  }, [location.state]);

  return (
    <RequestFormContext.Provider value={{ ...context, ...providerValue }}>
      <RequestForm />
    </RequestFormContext.Provider>
  );
}

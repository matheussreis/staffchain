import EditRequest from './EditRequest';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import useEditPageCheck from '../../hooks/use-edit-page-check';
import { RequestFormContext } from '../../store/request-form-context';
import RequestFormView from '../../components/RequestForm/RequestFormView';

export default function Request() {
  const isEdit = useEditPageCheck();

  const location = useLocation();
  const { id: requestId } = useParams();

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
    if (metadata.id !== '') {
      return;
    }

    if (location.state) {
      // Don't call the API, and use the given state.
      console.log(`REQUEST ID = ${requestId} | USE REQUEST DATA FROM STATE`);

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
      // Call API using the request ID to fetch the request data.
      console.log(`REQUEST ID = ${requestId} | USE REQUEST DATA FROM API`);

      setMetadata({
        id: 'abc',
        name: 'Request New Computers',
        description: 'Request new computers for the IT department.',
        fields: [
          {
            id: '416678a0-4835-4a6e-9353-440d2a6acc63',
            name: 'Expense Amount (€)',
            required: { value: '1', label: 'Yes' },
            type: { value: 'number', label: 'Number' },
            value: '5000',
          },
          {
            id: '0d057218-b01b-417b-93ee-def79e39024e',
            name: 'Expense Date',
            required: { value: '1', label: 'Yes' },
            type: { value: 'date', label: 'Date' },
            value: '2023-06-24',
          },
          {
            id: '78b82f08-aa46-44ab-bdb0-a10d78cb7c3d',
            name: 'Expense Description',
            required: { value: '1', label: 'Yes' },
            type: { value: 'textarea', label: 'Text Area' },
            value:
              'Two new computers are required for the IT department. Two of our developers have really old machines, that need to be replaced.',
          },
          {
            id: '5f49af2f-e575-46f3-88ea-97a3a6915c4c',
            name: 'Computer Specs',
            required: { value: '1', label: 'Yes' },
            type: { value: 'textarea', label: 'Text Area' },
            value:
              'Both computers have the same specs. Core I7 processor, 16GB RAM DDR4, 512GB SSD, 15 inch screen and GTX 3080 TI graphics card.',
          },
          {
            id: '5f49af2f-e575-46f3-88ea-97a3a6915c3d',
            name: 'Expense Proof',
            required: { value: '1', label: 'Yes' },
            type: { value: 'file', label: 'File' },
            value: 'FICHA_PRATICA_20230620.pdf',
          },
        ],
        status: 'Open',
        starter: { id: '1001', name: 'Emma Brown' },
        reviewer: { id: '1000', name: 'John Doe' },
      });

      setComments([
        {
          id: 1000,
          content:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum suscipit tenetur incidunt, optio, corrupti hic odit provident architecto eius error repudiandae debitis fuga adipisci quos vero doloribus quisquam excepturi dolorum.',
          author: { id: 1000, name: 'John Doe' },
          publishDate: '2023-06-26',
        },
        {
          id: 1002,
          content:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum suscipit tenetur incidunt, optio, corrupti hic odit provident architecto eius error repudiandae debitis fuga adipisci quos vero doloribus quisquam excepturi dolorum.',
          author: { id: 1001, name: 'Emma Brown' },
          publishDate: '2023-06-26',
        },
        {
          id: 1003,
          content:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum suscipit tenetur incidunt, optio, corrupti hic odit provident architecto eius error repudiandae debitis fuga adipisci quos vero doloribus quisquam excepturi dolorum.',
          author: { id: 1000, name: 'John Doe' },
          publishDate: '2023-06-26',
        },
      ]);
    }
  }, [requestId, location.state, metadata]);

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

import EditProcess from './EditProcess';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import useEditPageCheck from '../../hooks/use-edit-page-check';
import { ProcessFormContext } from '../../store/process-form-context';
import ProcessFormView from '../../components/ProcessForm/ProcessFormView';

export default function Process() {
  const location = useLocation();
  const { id: processId } = useParams();
  const isEdit = useEditPageCheck();

  const [id, setId] = useState('');
  const [step1, setStep1] = useState({
    fields: {
      name: { value: '' },
      description: { value: '' },
    },
  });
  const [step2, setStep2] = useState({ processMetadata: { fields: [] } });
  const [step3, setStep3] = useState({ processUsers: { users: [] } });
  const [step4, setStep4] = useState({
    requestTree: { availableUsers: [], selectedUsers: {} },
  });

  const UserComponent = isEdit ? EditProcess : ProcessFormView;

  useEffect(() => {
    if (id !== '') {
      return;
    }

    if (location.state) {
      // Don't call the API, and use the given state.
      console.log(`PROCESS ID = ${processId} | USE PROCESS DATA FROM STATE`);
      setId(location.state.id);
      setStep1(location.state.step1);
      setStep2(location.state.step2);
      setStep3(location.state.step3);
      setStep4(location.state.step4);
    } else {
      // Call API using the process ID to fetch the process data.
      console.log(`PROCESS ID = ${processId} | USE PROCESS DATA FROM API`);
      setId(processId);
      setStep1({
        fields: {
          name: { value: 'Request New Computers' },
          description: {
            value: 'Request new computers for the development team.',
          },
        },
      });
      setStep2({
        processMetadata: {
          fields: [
            {
              id: '416678a0-4835-4a6e-9353-440d2a6acc63',
              name: 'Expense Amount (€)',
              required: { value: '1', label: 'Yes' },
              type: { value: 'number', label: 'Number' },
            },
            {
              id: '0d057218-b01b-417b-93ee-def79e39024e',
              name: 'Expense Date',
              required: { value: '1', label: 'Yes' },
              type: { value: 'date', label: 'Date' },
            },
            {
              id: '78b82f08-aa46-44ab-bdb0-a10d78cb7c3d',
              name: 'Expense Description',
              required: { value: '1', label: 'Yes' },
              type: { value: 'textarea', label: 'Text Area' },
            },
            {
              id: '5f49af2f-e575-46f3-88ea-97a3a6915c4c',
              name: 'Computer Specs',
              required: { value: '1', label: 'Yes' },
              type: { value: 'textarea', label: 'Text Area' },
            },
          ],
        },
      });
      setStep3({
        processUsers: {
          users: [
            {
              id: 'u4',
              name: 'Thomas Stone',
              role: 'Solutions Architect',
              department: 'Delivery',
            },
            {
              id: 'u3',
              name: 'Emma Brown',
              role: 'CFO',
              department: 'Executive',
            },
            {
              id: 'u2',
              name: 'Lucy White',
              role: 'CTO',
              department: 'Executive',
            },
            {
              id: 'u1',
              name: 'John Doe',
              role: 'CEO',
              department: 'Executive',
            },
          ],
        },
      });
      setStep4({
        requestTree: {
          availableUsers: [
            {
              id: 'u1',
              name: 'John Doe',
              role: 'CEO',
              department: 'Executive',
              reportsTo: { id: 'u2', name: 'Lucy White' },
            },
            {
              id: 'u2',
              name: 'Lucy White',
              role: 'CTO',
              department: 'Executive',
              reportsTo: { id: 'u4', name: 'Thomas Stone' },
            },
            {
              id: 'u3',
              name: 'Emma Brown',
              role: 'CFO',
              department: 'Executive',
              reportsTo: { id: 'u4', name: 'Thomas Stone' },
            },
            {
              id: 'u4',
              name: 'Thomas Stone',
              role: 'Solutions Architect',
              department: 'Delivery',
              reportsTo: { id: 'u4', name: 'Thomas Stone' },
            },
          ],
          selectedUsers: {
            u1: {
              id: 'u1',
              name: 'John Doe',
              role: 'CEO',
              department: 'Executive',
              reportsTo: { id: 'u2', name: 'Lucy White' },
            },
            u2: {
              id: 'u2',
              name: 'Lucy White',
              role: 'CTO',
              department: 'Executive',
              reportsTo: { id: 'u4', name: 'Thomas Stone' },
            },
            u3: {
              id: 'u3',
              name: 'Emma Brown',
              role: 'CFO',
              department: 'Executive',
              reportsTo: { id: 'u4', name: 'Thomas Stone' },
            },
            u4: {
              id: 'u4',
              name: 'Thomas Stone',
              role: 'Solutions Architect',
              department: 'Delivery',
              reportsTo: { id: 'u4', name: 'Thomas Stone' },
            },
          },
        },
      });
    }
  }, [id, location.state, processId]);

  return (
    <ProcessFormContext.Provider
      value={{
        step1: step1,
        step2: step2,
        step3: step3,
        step4: step4,
      }}
    >
      <UserComponent />
    </ProcessFormContext.Provider>
  );
}

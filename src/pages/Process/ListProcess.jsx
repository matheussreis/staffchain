import { useEffect, useState } from 'react';
import ProcessList from '../../components/ProcessList/ProcessList';

const DUMMY_PROCESSES = [
  {
    id: '1001',
    step1: {
      fields: {
        name: { value: 'New Furniture' },
        description: {
          value: 'request new furniture for the IT department.',
        },
      },
    },
    step2: {
      processMetadata: {
        fields: [
          {
            id: 'f557781c-9e6e-4fc4-ac5d-3bcb54fff603',
            name: 'Number of tables',
            required: { value: '1', label: 'Yes' },
            type: { value: 'number', label: 'Number' },
          },
          {
            id: '5287bf55-a7d1-4774-8150-9ae036dc70ad',
            name: 'Number of chairs',
            required: { value: '1', label: 'Yes' },
            type: { value: 'number', label: 'Number' },
          },
          {
            id: '8f97f4d5-a349-40c9-8898-8670b69d3368',
            name: 'Number of desk lamps',
            required: { value: '1', label: 'Yes' },
            type: { value: 'number', label: 'Number' },
          },
          {
            id: '546414ca-14e2-4124-8d18-cd9978224623',
            name: 'Request reason',
            required: { value: '1', label: 'Yes' },
            type: { value: 'textarea', label: 'Text Area' },
          },
        ],
      },
    },
    step3: {
      processUsers: {
        users: [
          {
            id: 'u1',
            name: 'John Doe',
            role: 'CEO',
            department: 'Executive',
          },
          {
            id: 'u2',
            name: 'Lucy White',
            role: 'CTO',
            department: 'Executive',
          },
          {
            id: 'u6',
            name: 'Jimmy Storm',
            role: 'Developer',
            department: 'Delivery',
          },
          {
            id: 'u5',
            name: 'Julia Gray',
            role: 'Junior Developer',
            department: 'Delivery',
          },
        ],
      },
      systemUsers: {
        users: [
          {
            id: 'u1',
            name: 'John Doe',
            role: 'CEO',
            department: 'Executive',
          },
          {
            id: 'u2',
            name: 'Lucy White',
            role: 'CTO',
            department: 'Executive',
          },
          {
            id: 'u6',
            name: 'Jimmy Storm',
            role: 'Developer',
            department: 'Delivery',
          },
          {
            id: 'u5',
            name: 'Julia Gray',
            role: 'Junior Developer',
            department: 'Delivery',
          },
        ],
      },
    },
    step4: {
      requestTree: {
        availableUsers: [
          {
            id: 'u1',
            name: 'John Doe',
            role: 'CEO',
            department: 'Executive',
          },
          {
            id: 'u2',
            name: 'Lucy White',
            role: 'CTO',
            department: 'Executive',
          },
          {
            id: 'u6',
            name: 'Jimmy Storm',
            role: 'Developer',
            department: 'Delivery',
          },
          {
            id: 'u5',
            name: 'Julia Gray',
            role: 'Junior Developer',
            department: 'Delivery',
          },
        ],
        selectedUsers: {
          u1: {
            id: 'u1',
            name: 'John Doe',
            department: 'Executive',
            reportsTo: { id: 'u1', name: 'John Doe' },
            role: 'CEO',
          },
          u2: {
            id: 'u2',
            name: 'Lucy White',
            department: 'Executive',
            reportsTo: { id: 'u1', name: 'John Doe' },
            role: 'CTO',
          },
          u5: {
            id: 'u5',
            name: 'Julia Gray',
            department: 'Delivery',
            reportsTo: { id: 'u2', name: 'Lucy White' },
            role: 'Junior Developer',
          },
          u6: {
            id: 'u6',
            name: 'Jimmy Storm',
            department: 'Delivery',
            reportsTo: { id: 'u2', name: 'Lucy White' },
            role: 'Developer',
          },
        },
      },
    },
  },
  {
    id: '1002',
    step1: {
      fields: {
        name: { value: 'Employee Refund' },
        description: {
          value:
            "Request refund for the employee's expenses due to the business duty.",
        },
      },
    },
    step2: {
      processMetadata: {
        fields: [
          {
            id: 'f1',
            name: 'Expense Amount (€)',
            required: { value: '1', label: 'Yes' },
            type: { value: 'number', label: 'Number' },
          },
          {
            id: 'f2',
            name: 'Expense Reason',
            required: { value: '1', label: 'Yes' },
            type: { value: 'textarea', label: 'Text Area' },
          },
          {
            id: 'f3',
            name: 'Expense Date',
            required: { value: '1', label: 'Yes' },
            type: { value: 'date', label: 'Date' },
          },
        ],
      },
    },
    step3: {
      processUsers: {
        users: [
          {
            id: 'u1',
            name: 'John Doe',
            role: 'CEO',
            department: 'Executive',
          },
          {
            id: 'u2',
            name: 'Lucy White',
            role: 'CTO',
            department: 'Executive',
          },
          {
            id: 'u6',
            name: 'Jimmy Storm',
            role: 'Developer',
            department: 'Delivery',
          },
          {
            id: 'u5',
            name: 'Julia Gray',
            role: 'Junior Developer',
            department: 'Delivery',
          },
        ],
      },
      systemUsers: {
        users: [
          {
            id: 'u1',
            name: 'John Doe',
            role: 'CEO',
            department: 'Executive',
          },
          {
            id: 'u2',
            name: 'Lucy White',
            role: 'CTO',
            department: 'Executive',
          },
          {
            id: 'u6',
            name: 'Jimmy Storm',
            role: 'Developer',
            department: 'Delivery',
          },
          {
            id: 'u5',
            name: 'Julia Gray',
            role: 'Junior Developer',
            department: 'Delivery',
          },
        ],
      },
    },
    step4: {
      requestTree: {
        availableUsers: [
          {
            id: 'u1',
            name: 'John Doe',
            role: 'CEO',
            department: 'Executive',
          },
          {
            id: 'u2',
            name: 'Lucy White',
            role: 'CTO',
            department: 'Executive',
          },
          {
            id: 'u6',
            name: 'Jimmy Storm',
            role: 'Developer',
            department: 'Delivery',
          },
          {
            id: 'u5',
            name: 'Julia Gray',
            role: 'Junior Developer',
            department: 'Delivery',
          },
        ],
        selectedUsers: {
          u1: {
            id: 'u1',
            name: 'John Doe',
            department: 'Executive',
            reportsTo: { id: 'u1', name: 'John Doe' },
            role: 'CEO',
          },
          u2: {
            id: 'u2',
            name: 'Lucy White',
            department: 'Executive',
            reportsTo: { id: 'u1', name: 'John Doe' },
            role: 'CTO',
          },
          u5: {
            id: 'u5',
            name: 'Julia Gray',
            department: 'Delivery',
            reportsTo: { id: 'u2', name: 'Lucy White' },
            role: 'Junior Developer',
          },
          u6: {
            id: 'u6',
            name: 'Jimmy Storm',
            department: 'Delivery',
            reportsTo: { id: 'u2', name: 'Lucy White' },
            role: 'Developer',
          },
        },
      },
    },
  },
];

export default function ListProcess() {
  const [processes, setProcesses] = useState([]);

  useEffect(() => {
    // call the API to fetch the list of processes.
    console.log(`FETCH PROCESSES LIST TO DISPLAY`);
    setProcesses(DUMMY_PROCESSES);
  }, []);

  return <ProcessList processes={processes} />;
}

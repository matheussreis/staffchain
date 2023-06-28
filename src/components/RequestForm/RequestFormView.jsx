import { useContext } from 'react';
import Card from '../UI/Card/Card';
import { Tag } from 'primereact/tag';
import Button from '../UI/Button/Button';
import FormRow from '../UI/Form/FormRow';
import { useNavigate } from 'react-router-dom';
import FieldView from '../UI/FieldView/FieldView';
import BUTTON_SIZES from '../../enums/button-sizes';
import ActionButton from '../UI/ActionButton/ActionButton';
import CommentSection from '../UI/CommentSection/CommentSection';
import { RequestFormContext } from '../../store/request-form-context';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import classes from './RequestFormView.module.css';

const items = [
  {
    label: 'Approve',
    command: () => {
      const onAccept = () => {
        // Send API call to the server to change the request status
        // to approved, if there's no more users that need to review
        // the request, or to waiting for review, in case there are
        // more users in the hierarchy that need to review the request.
        console.log('Approve');
      };

      confirmDialog({
        draggable: false,
        message: 'Are you sure you would like to approve this request?',
        header: 'Approve Request',
        accept: onAccept,
      });
    },
  },
  {
    label: 'Reject',
    command: () => {
      const onAccept = () => {
        // Send API call to the server to change the request status
        // to rejected.
        console.log('Reject');
      };

      confirmDialog({
        draggable: false,
        message: 'Are you sure you would like to reject this request?',
        header: 'Reject Request',
        accept: onAccept,
      });
    },
  },
  {
    label: 'More Info',
    command: () => {
      const onAccept = () => {
        // Send API call to the server to change the request status
        // to waiting for review and re-assign the request to the previous
        // user.
        console.log('More Info');
      };

      confirmDialog({
        draggable: false,
        message: 'Are you sure you would like to ask for more infomation?',
        header: 'Ask for More Information',
        accept: onAccept,
      });
    },
  },
];

function RequestFormHeader({ requestName, requestStarter }) {
  const navigate = useNavigate();

  return (
    <>
      <div className={classes['title-container']}>
        <Tag value="In Progess" severity="info" className={classes.tag} />
        <h1 className={classes.title}>{requestName}</h1>
        <div className={classes['request-starter']}>
          <label>Created By:</label>
          <span>{requestStarter}</span>
        </div>
      </div>
      <div className={classes['button-container']}>
        <ActionButton
          className={classes.button}
          label="Options"
          items={items}
        />
        <Button
          onClick={() => navigate('edit')}
          className={classes.button}
          size={BUTTON_SIZES.SMALL}
        >
          Edit
        </Button>
      </div>
    </>
  );
}

export default function RequestFormView() {
  const { request } = useContext(RequestFormContext);

  return (
    <>
      <ConfirmDialog />
      <Card className={classes.card}>
        <FormRow className={classes['header-row']}>
          <RequestFormHeader
            requestName={request.name}
            requestStarter={request.createdBy.name}
          />
        </FormRow>
        {request.fields.map((field) => (
          <FieldView
            key={field.id}
            label={`${field.name}:`}
            content={field.value}
            type={field.type.value}
          />
        ))}
      </Card>
      <CommentSection
        comments={request.comments}
        updateComments={request.updateComments}
      />
    </>
  );
}

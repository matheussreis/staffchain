import axios from 'axios';
import Card from '../UI/Card/Card';
import { Tag } from 'primereact/tag';
import Button from '../UI/Button/Button';
import FormRow from '../UI/Form/FormRow';
import { Toast } from 'primereact/toast';
import { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FieldView from '../UI/FieldView/FieldView';
import BUTTON_SIZES from '../../enums/button-sizes';
import { translateEnum } from '../../enums/request-status';
import ActionButton from '../UI/ActionButton/ActionButton';
import CommentSection from '../UI/CommentSection/CommentSection';
import { RequestFormContext } from '../../store/request-form-context';
import { getTagSeverityByRequestStatus } from '../../utils/enum-utils';
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

const getFilePath = (fileId, fileName) => {
  const { REACT_APP_SERVER_API_URL: API_URL } = process.env;
  return `${API_URL}/file/${fileId}/${fileName}`;
};

function RequestFormHeader() {
  const navigate = useNavigate();
  const { request } = useContext(RequestFormContext);

  return (
    <>
      <div className={classes['title-container']}>
        <Tag
          value={translateEnum(request.status)}
          severity={getTagSeverityByRequestStatus(request.status)}
          className={classes.tag}
        />
        <h1 className={classes.title}>{request.name}</h1>
        <div className={classes['request-starter']}>
          <label>Created By:</label>
          <span>{request.starter.name}</span>
        </div>
      </div>
      <div className={classes['button-container']}>
        <ActionButton
          className={classes.button}
          label="Options"
          items={items}
        />
        <Button
          onClick={() =>
            navigate('edit', {
              state: {
                id: request.id,
                name: request.name,
                description: request.description,
                fields: request.fields,
                status: request.status,
                comments: request.comments,
                starter: request.starter,
                reviewer: request.reviewer,
              },
            })
          }
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
  const toastRef = useRef(null);

  const addComment = async (comment) => {
    const { REACT_APP_SERVER_API_URL: API_URL } = process.env;
    const { id } = request;

    try {
      await axios.post(`${API_URL}/request/${id}/comment`, {
        authorId: comment.authorId,
        comment: comment.comment,
        publishDate: comment.publishDate,
      });
    } catch (error) {
      toastRef.current.clear();
      toastRef.current.show({
        severity: 'error',
        summary: 'Add Comment Failure',
        detail: error.message,
        sticky: true,
        style: { margin: '0.5rem' },
      });
    }
  };

  return (
    <>
      <Toast ref={toastRef} position="top-center" />
      <ConfirmDialog />
      <Card className={classes.card}>
        <FormRow className={classes['header-row']}>
          <RequestFormHeader />
        </FormRow>
        {request.fields.map((field) => (
          <FieldView
            key={field.id}
            label={`${field.name}:`}
            content={field.value}
            type={field.type}
            downloadUrl={
              field.type === 'file'
                ? getFilePath(field.id, field.value)
                : undefined
            }
          />
        ))}
      </Card>
      <CommentSection
        comments={request.comments}
        updateComments={request.updateComments}
        onAddComment={addComment}
      />
    </>
  );
}

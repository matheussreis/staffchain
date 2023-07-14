import axios from 'axios';
import Card from '../UI/Card/Card';
import { Tag } from 'primereact/tag';
import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';
import FormRow from '../UI/Form/FormRow';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import useInput from '../../hooks/use-input';
import FIELD_TYPES from '../../enums/field-types';
import FieldView from '../UI/FieldView/FieldView';
import BUTTON_SIZES from '../../enums/button-sizes';
import { useContext, useRef, useState } from 'react';
import { translateEnum } from '../../enums/request-status';
import ActionButton from '../UI/ActionButton/ActionButton';
import { useNavigate, useRevalidator } from 'react-router-dom';
import CommentSection from '../UI/CommentSection/CommentSection';
import { RequestFormContext } from '../../store/request-form-context';
import { CurrentUserContext } from '../../store/current-user-context';
import { getTagSeverityByRequestStatus } from '../../utils/enum-utils';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import classes from './RequestFormView.module.css';

const { REACT_APP_SERVER_API_URL: API_URL } = process.env;

const getFilePath = (requestId, fileId, fileName) => {
  return `${API_URL}/file/${requestId}/${fileId}/${fileName}`;
};

function ReasonModal({ visible, setVisible, isMoreInfo, onConfirm }) {
  const inputFieldName = isMoreInfo ? 'Information Description' : 'Reason';

  const {
    value: reasonValue,
    valueChangeHandler: reasonChangeHandler,
    inputBlurHandler: reasonBlurHandler,
    hasError: reasonHasError,
    isValid: reasonIsValid,
    errorMessage: reasonErrorMessage,
    reset: resetReason,
  } = useInput([FIELD_TYPES.TEXTAREA, [inputFieldName]]);

  const ReasonModalFooter = () => (
    <>
      <Button
        onClick={async () => {
          await onConfirm(reasonValue);
          resetReason();
        }}
        disabled={!reasonIsValid}
      >
        {isMoreInfo ? 'Ask For More Information' : 'Close Request'}
      </Button>
      <Button onClick={() => setVisible(false)}>Close</Button>
    </>
  );

  const dialogHeader = isMoreInfo
    ? 'What information do you need?'
    : 'What is the reason to close the request?';

  return (
    <div>
      <Dialog
        draggable={false}
        header={dialogHeader}
        visible={visible}
        style={{ width: '80vw' }}
        onHide={() => setVisible(false)}
        footer={ReasonModalFooter}
      >
        <Input
          isSingleLine
          type="textarea"
          id="reason"
          name="reason"
          placeholder={inputFieldName}
          onBlur={reasonBlurHandler}
          onChange={reasonChangeHandler}
          value={reasonValue}
          hasError={reasonHasError}
          errorMessage={reasonErrorMessage}
        />
      </Dialog>
    </div>
  );
}

function RequestPeople({ starter, reviewer }) {
  return (
    <div className={classes['request-people']}>
      <div className={classes['request-person']}>
        <label>Starter:</label>
        <span>{starter}</span>
      </div>
      <div className={classes['request-person']}>
        <label>Reviewer:</label>
        <span>{reviewer}</span>
      </div>
    </div>
  );
}

function RequestFormHeader({ setShowReasonModal, setIsMoreInfo, onApprove }) {
  const navigate = useNavigate();
  const { request } = useContext(RequestFormContext);
  const { user } = useContext(CurrentUserContext);

  const items = [
    {
      label: 'Approve',
      command: () => {
        confirmDialog({
          draggable: false,
          message: 'Are you sure you would like to approve this request?',
          header: 'Approve Request',
          accept: onApprove,
        });
      },
    },
    {
      label: 'Close',
      command: () => {
        const onClose = () => {
          setShowReasonModal(true);
          setIsMoreInfo(false);
        };

        confirmDialog({
          draggable: false,
          message: 'Are you sure you would like to close this request?',
          header: 'Close Request',
          accept: onClose,
        });
      },
    },
    {
      label: 'More Info',
      command: () => {
        const onMoreInfo = () => {
          setShowReasonModal(true);
          setIsMoreInfo(true);
        };

        confirmDialog({
          draggable: false,
          message: 'Are you sure you would like to ask for more infomation?',
          header: 'Ask for More Information',
          accept: onMoreInfo,
        });
      },
    },
  ];

  const isRequestStatusValid =
    request.status !== 'closed' && request.status !== 'done';
  const isCurrentUserReviewer = user.id === request.reviewer.id;
  const isCurrentUserAdmin = user.isAdmin;

  return (
    <>
      <div className={classes['title-container']}>
        <Tag
          value={translateEnum(request.status)}
          severity={getTagSeverityByRequestStatus(request.status)}
          className={classes.tag}
        />
        <h1 className={classes.title}>{request.name}</h1>
        <RequestPeople
          starter={request.starter.name}
          reviewer={request.reviewer.name}
        />
      </div>

      <div className={classes['button-container']}>
        {isCurrentUserReviewer && isRequestStatusValid && (
          <ActionButton
            className={classes.button}
            label="Options"
            items={items}
          />
        )}
        {(isCurrentUserReviewer || isCurrentUserAdmin) &&
          isRequestStatusValid && (
            <Button
              onClick={() =>
                navigate('edit', {
                  state: {
                    id: request.id,
                    name: request.name,
                    description: request.description,
                    processId: request.processId,
                    fields: request.fields,
                    status: request.status,
                    comments: request.comments,
                    starter: request.starter,
                    reviewer: request.reviewer,
                  },
                })
              }
              className={classes.button}
              size={
                isCurrentUserReviewer ? BUTTON_SIZES.SMALL : BUTTON_SIZES.MEDIUM
              }
            >
              Edit
            </Button>
          )}
      </div>
      <hr className={classes.line} />
    </>
  );
}

export default function RequestFormView() {
  const { request } = useContext(RequestFormContext);
  const toastRef = useRef(null);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [isMoreInfo, setIsMoreInfo] = useState(true);
  const revalidator = useRevalidator();

  const addComment = async (comment) => {
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

  const confirmReasonModalHandler = async (reason) => {
    const endpointName = isMoreInfo ? 'more-info' : 'close';

    try {
      await axios.post(`${API_URL}/request/${request.id}/${endpointName}`, {
        reason: reason,
      });

      revalidator.revalidate();
      setShowReasonModal(false);

      const message = isMoreInfo
        ? 'Request sent asking for more information.'
        : 'Request Closed Successfully.';

      toastRef.current.clear();
      toastRef.current.show({
        severity: 'success',
        summary: 'Success',
        detail: message,
        sticky: true,
        style: { margin: '0.5rem' },
      });
    } catch (error) {
      const summary = isMoreInfo
        ? 'Failure Asking for More Information'
        : 'Failure Closing Request';

      toastRef.current.clear();
      toastRef.current.show({
        severity: 'error',
        summary: summary,
        detail: error.message,
        sticky: true,
        style: { margin: '0.5rem' },
      });
    }
  };

  const approveRequestHandler = async () => {
    try {
      await axios.post(`${API_URL}/request/${request.id}/approve`);
      revalidator.revalidate();

      toastRef.current.clear();
      toastRef.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Request Approved Successfully!',
        sticky: true,
        style: { margin: '0.5rem' },
      });
    } catch (error) {
      toastRef.current.clear();
      toastRef.current.show({
        severity: 'error',
        summary: 'Failure Approving Request',
        detail: error.message,
        sticky: true,
        style: { margin: '0.5rem' },
      });
    }
  };

  return (
    <>
      <Toast ref={toastRef} position="top-center" />
      <ReasonModal
        visible={showReasonModal}
        setVisible={setShowReasonModal}
        isMoreInfo={isMoreInfo}
        onConfirm={confirmReasonModalHandler}
      />
      <ConfirmDialog />
      <Card className={classes.card}>
        <FormRow className={classes['header-row']}>
          <RequestFormHeader
            setShowReasonModal={setShowReasonModal}
            setIsMoreInfo={setIsMoreInfo}
            onApprove={approveRequestHandler}
          />
        </FormRow>
        {request.fields.map((field) => (
          <FieldView
            key={field.id}
            label={`${field.name}:`}
            content={field.value}
            type={field.type}
            downloadUrl={
              field.type === 'file'
                ? getFilePath(request.id, field.id, field.value)
                : undefined
            }
          />
        ))}
      </Card>
      <CommentSection
        comments={request.comments}
        updateComments={request.updateComments}
        onAddComment={addComment}
        showCommentControls={request.status !== 'closed'}
      />
    </>
  );
}

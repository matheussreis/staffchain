import List from '../List/List';
import { v4 as uuid } from 'uuid';
import { useContext } from 'react';
import Input from '../Input/Input';
import Button from '../Button/Button';
import useInput from '../../../hooks/use-input';
import FIELD_TYPES from '../../../enums/field-types';
import { CurrentUserContext } from '../../../store/current-user-context';

import classes from './CommentSection.module.css';

function CommentItemHeader({ comment }) {
  return (
    <div className={classes['comment-header']}>
      <h4>{comment.author.name}</h4> -{' '}
      <p>{new Date(comment.publishDate).toLocaleString()}</p>
    </div>
  );
}

function CommentItem({ comment }) {
  return (
    <li className={classes['comment-container']}>
      <CommentItemHeader comment={comment} />
      <p>{comment.comment}</p>
    </li>
  );
}

function CommentList({ comments }) {
  return (
    <List className={classes['comment-list']}>
      {comments.map((comment) => (
        <CommentItem id={comment.id} key={comment.id} comment={comment} />
      ))}
    </List>
  );
}

function CommentControls({
  value,
  onChange,
  onBlur,
  onAddComment,
  buttonDisabled,
}) {
  return (
    <div className={classes['comment-controls']}>
      <Input
        placeholder="Add a comment..."
        type={FIELD_TYPES.TEXTAREA}
        useLabel={false}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
      <Button disabled={buttonDisabled} onClick={onAddComment}>
        Add Comment
      </Button>
    </div>
  );
}

export default function CommentSection({
  comments,
  updateComments,
  onAddComment,
  showCommentControls = true,
}) {
  const {
    value: commentValue,
    valueChangeHandler: commentChangeHandler,
    inputBlurHandler: commentBlurHandler,
    isValid: commentIsValid,
    reset: resetComment,
  } = useInput([FIELD_TYPES.TEXTAREA, ['Comment']]);

  const currentUserContext = useContext(CurrentUserContext);

  const addCommentHandler = () => {
    const { id, firstName, lastName } = currentUserContext.user;
    const publishDate = new Date().toISOString().slice(0, 19);

    updateComments([
      {
        id: uuid(),
        comment: commentValue,
        publishDate: publishDate,
        author: {
          id: id,
          name: `${firstName} ${lastName}`,
        },
      },
      ...comments,
    ]);

    typeof onAddComment === 'function' &&
      onAddComment({
        comment: commentValue,
        publishDate: publishDate,
        authorId: id,
      });

    resetComment();
  };

  return (
    <div className={classes.container}>
      {showCommentControls && (
        <CommentControls
          value={commentValue}
          onChange={commentChangeHandler}
          onBlur={commentBlurHandler}
          onAddComment={addCommentHandler}
          buttonDisabled={!commentIsValid}
        />
      )}

      {(comments.length > 0 || showCommentControls) && (
        <CommentList comments={comments} />
      )}
    </div>
  );
}

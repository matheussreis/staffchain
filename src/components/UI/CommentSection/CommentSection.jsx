import List from '../List/List';
import Card from '../Card/Card';
import { v4 as uuid } from 'uuid';
import Input from '../Input/Input';
import Button from '../Button/Button';
import useInput from '../../../hooks/use-input';
import FIELD_TYPES from '../../../enums/field-types';

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
      <p>{comment.content}</p>
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

export default function CommentSection({ comments, updateComments }) {
  const {
    value: commentValue,
    valueChangeHandler: commentChangeHandler,
    inputBlurHandler: commentBlurHandler,
    isValid: commentIsValid,
    reset: resetComment,
  } = useInput([FIELD_TYPES.TEXTAREA, ['Comment']]);

  const addCommentHandler = () => {
    // Add logic to use the current user id and name as
    // the author.
    updateComments([
      {
        id: uuid(),
        content: commentValue,
        publishDate: new Date().toISOString().slice(0, 19),
        author: { id: 1000, name: 'John Doe' },
      },
      ...comments,
    ]);

    resetComment();
  };

  return (
    <Card className={classes.card}>
      <div>
        <h2 className={classes.title}>Comments</h2>
        <Input
          placeholder="Add a comment..."
          type={FIELD_TYPES.TEXTAREA}
          useLabel={false}
          value={commentValue}
          onChange={commentChangeHandler}
          onBlur={commentBlurHandler}
        />
        <Button disabled={!commentIsValid} onClick={addCommentHandler}>
          Add Comment
        </Button>
      </div>
      <CommentList comments={comments} />
    </Card>
  );
}

import { ChangeEvent, FC, Fragment, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import Textarea from '../components/Textarea';
import Button from '../components/Button';
import { useAppDispatch, useAppSelector } from '../store/store';
import { isEditingHandler } from '../store/commentSlice';

interface PostFormPropType {
  commentHandler: (arg0: string) => void;
  isInputFocused: boolean;
}

const PostForm: FC<PostFormPropType> = ({ commentHandler, isInputFocused }) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useAppDispatch();

  const [commentvalue, setCommentvalue] = useState<string>('');
  const editing = useAppSelector((state) => state.comment.editing);

  useEffect(() => {
    if (editing.status && editing.text) {
      setCommentvalue(editing.text);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
    if (inputRef.current && isInputFocused) {
      inputRef.current.focus();
    }
  }, [editing.status, editing.text, isInputFocused]);

  const submitButtonHandler = () => {
    commentHandler(commentvalue);
    setCommentvalue('');
  };

  return (
    <Container>
      <Textarea
        id="comment-preview"
        value={commentvalue}
        rows={1}
        ref={inputRef}
        className="textarea-container"
        placeholder="Add a comment..."
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
          return setCommentvalue(e.target.value);
        }}
      />
      {commentvalue && !editing.status && (
        <Button
          children={'Post'}
          isLoading={false}
          className="btn"
          onClick={submitButtonHandler}
        />
      )}
      {commentvalue && editing.status && (
        <Fragment>
          <Button
            children={'Edit'}
            isLoading={false}
            className="btn"
            onClick={submitButtonHandler}
          />
          <Button
            children={'Cancel'}
            isLoading={false}
            className="btn btn-danger"
            onClick={() => dispatch(isEditingHandler({ status: false }))}
          />
        </Fragment>
      )}
    </Container>
  );
};

export default PostForm;

const Container = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  display: flex;
  .textarea-container {
    width: 85%;
    margin: 0;
    .input-container {
      margin: 0;
      textarea {
        overflow: auto;
        background-color: transparent;
        border: none;
        resize: none;
        border-radius: 0;
        padding: 0.375rem 0;
        &:focus {
          margin-bottom: -1px;
          border-bottom: 1px solid var(--primary-purple);
        }
      }
    }
  }

  .btn {
    width: 15%;
    background-color: transparent;
    color: #b8b8b8;
    outline: none;
    transition: color 0.1s ease-in-out;
    &:hover {
      color: var(--primary-hover-blue);
    }
  }
  .btn-danger {
    color: var(--danger-red);
  }
`;

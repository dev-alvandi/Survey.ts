import { ChangeEvent, FC, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import Textarea from '../components/Textarea';
import Button from '../components/Button';
import { BASE_API_URL } from '../utils/api';

interface PostFormPropType {
  commentHandler: (arg0: string) => void;
}

const PostForm: FC<PostFormPropType> = ({ commentHandler }) => {
  const [commentvalue, setCommentvalue] = useState('');

  // const commentHandler = () => {
  //   const config = {
  //     headers: {
  //       Authorization: 'Bearer ' + localStorage.getItem('token'),
  //     },
  //   };

  //   axios
  //     .post(
  //       `${BASE_API_URL}/feed/new-comment/${postId}`,
  //       { comment: commentvalue },
  //       config
  //     )
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  return (
    <Container>
      <Textarea
        id="comment"
        value={commentvalue}
        rows={1}
        className="textarea-container"
        placeholder="Add a comment..."
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
          return setCommentvalue(e.target.value);
        }}
      />
      {commentvalue && (
        <Button
          children="Post"
          isLoading={false}
          className="btn"
          onClick={commentHandler.bind(null, commentvalue)}
        />
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
`;

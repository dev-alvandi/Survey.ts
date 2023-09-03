import styled from 'styled-components';
import { PostSchemaTypes } from '../store/postSlice';
import { Fragment, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/store';
import axios from 'axios';
import openSocket from 'socket.io-client';

import {
  BASE_API_IMAGE_url,
  BASE_API_URL,
  BASE_BACKEND_URL,
} from '../utils/api';
import PostHeader from '../layouts/PostHeader';
import PostActions from '../layouts/PostActions';
import PostForm from '../layouts/PostForm';
import PostComment from '../layouts/PostComment';
import { editCommentAction, isEditingHandler } from '../store/commentSlice';

const CompletePost = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const params = useParams();

  const [post, setPost] = useState<PostSchemaTypes>();
  const editing = useAppSelector((state) => state.comment.editing);

  useEffect(() => {
    const socket = openSocket(`${BASE_BACKEND_URL}`);
    socket.on('comments', (data: { action: string; post: PostSchemaTypes }) => {
      const dataActions = ['create', 'edit', 'delete', 'likedComment'];
      if (dataActions.includes(data.action)) {
        setPost(data.post);
      }
    });

    return () => {
      socket.off('comments');
    };
  }, [post, post?.comments]);

  useEffect(() => {
    const { postId } = params;
    axios
      .get(`${BASE_API_URL}/feed/receive-post/${postId}`)
      .then((res) => {
        if (res.status === 200) {
          setPost(res.data.post);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    return () => {
      // Clean up
      dispatch(isEditingHandler({ status: false }));
    };
  }, [dispatch, params]);

  const commentHandler = (comment: string) => {
    const { postId } = params;
    const config = {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    };

    if (editing.status) {
      // setMyComment(comment);
      return dispatch(
        editCommentAction({
          method: 'PUT',
          url: `${BASE_API_URL}/feed/edit-comment/${editing.commentId}`,
          comment: comment,
        })
      );
    }

    axios
      .post(
        `${BASE_API_URL}/feed/new-comment/${postId}`,
        { comment: comment },
        config
      )
      .then((res) => {
        if (res.status === 200) {
        }
      })
      .catch(({ response }) => {
        if (response.status === 401) {
          navigate('/login');
        }
      });
  };

  return (
    <Container>
      {post && (
        <Fragment>
          <div className="post-image">
            <img src={`${BASE_API_IMAGE_url}/${post.imageUrl}`} alt="" />
          </div>
          <div className="post-details">
            <div className="post-creator">
              <div className="post-header">
                <PostHeader post={post} />
              </div>
              <div className="post-caption">{post.caption}</div>
            </div>
            <div className="comments-container">
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((comment: any) => (
                  <PostComment key={comment._id} comment={comment} />
                ))
              ) : (
                <div className="no-comment">No Comments yet!</div>
              )}
            </div>
            <div className="post-actions">
              <PostActions post={post} />
            </div>
            <div className="comment-form">
              {params.postId && <PostForm commentHandler={commentHandler} />}
            </div>
          </div>
        </Fragment>
      )}
    </Container>
  );
};

export default CompletePost;

const Container = styled.div`
  --image-container-width: 70%;

  width: 100%;
  height: calc(100vh - 3rem);
  padding: 6rem 4rem 0 4rem;
  position: relative;
  border-radius: 0.2rem;
  display: flex;

  .post-image {
    width: var(--image-container-width);
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .post-details {
    width: calc(100% - var(--image-container-width));
    display: flex;
    flex-direction: column;
    padding-left: 1rem;

    & > div {
      border-top: 1px solid #cbcbcb;
    }

    .post-creator {
      display: flex;
      padding: 0.5rem 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 1rem;
      .post-header {
        width: 100%;
        display: flex;
        flex-direction: column;
      }
      .post-caption {
        padding: 0 0 0 calc(var(--creator-avatar-size) / 2);
      }
    }

    .comments-container {
      height: calc(100% - 13rem);
      overflow: scroll;
      &::-webkit-scrollbar {
        display: none;
        scrollbar-width: none;
        -ms-scrollbar-width: none;
      }
      .no-comment {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--secondary-text);
      }
    }

    .post-actions {
      height: 5rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .comment-form {
      height: 4rem;
      border-bottom: 1px solid #cbcbcb;
      display: flex;
      align-items: center;
    }
  }
`;

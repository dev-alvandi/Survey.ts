import { FC, Fragment, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import { PostSchemaTypes } from '../store/postSlice';
import { BASE_API_IMAGE_url, BASE_API_URL } from '../utils/api';
import PostHeader from '../layouts/PostHeader';
import PostActions from '../layouts/PostActions';
import PostForm from '../layouts/PostForm';
import toastOptions from '../utils/toastOptions';

interface PreviewPostsPropTypes {
  post: PostSchemaTypes;
  handleDeletedItem: (postId: string) => void;
}

const PreviewPosts: FC<PreviewPostsPropTypes> = ({
  post,
  handleDeletedItem,
}) => {
  const navigate = useNavigate();

  // const [commentvalue, setCommentvalue] = useState('');
  const [isShowMore, setIsShowMore] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const routingToComplePostHandler = () => {
    navigate(`/post/${post._id}`);
  };

  const commentHandler = (comment: string) => {
    const config = {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    };

    axios
      .post(
        `${BASE_API_URL}/feed/new-comment/${post._id}`,
        { comment: comment },
        config
      )
      .then((res) => {
        toast.success(res.data.msg, toastOptions);
      })
      .catch(({ response }) => {
        if (response.status === 401) {
          navigate('/login');
        }
      });
  };

  return (
    <Fragment>
      <ToastContainer />
      <Section>
        <div className="post-header">
          <PostHeader handleDeletedItem={handleDeletedItem} post={post} />
        </div>

        <div className="post-container" onClick={routingToComplePostHandler}>
          <img
            src={`${BASE_API_IMAGE_url}/${post.imageUrl}`}
            alt={post.title}
            className="img-post"
          />
        </div>

        <div className="post-details">
          <PostActions
            post={post}
            focusingOnInputHandler={() =>
              setIsInputFocused((prevState) => !prevState)
            }
          />

          <div className="caption-container">
            <span className="creator bold">{post.creator.name}</span>
            <span className="caption-body">
              {post.caption.length > 100 && !isShowMore
                ? `${post.caption.slice(0, 100)}...`
                : post.caption}
            </span>
            <div
              className="more-btn"
              onClick={() => setIsShowMore(!isShowMore)}>
              {post.caption.length > 100 ? (isShowMore ? 'less' : 'more') : ''}
            </div>
          </div>

          <div className="comments-container">
            <span className="view-comments">
              {post.comments && post.comments.length > 0
                ? `View all ${post.comments.length} comments`
                : 'No comment yet!'}
            </span>
            <PostForm
              commentHandler={commentHandler}
              isInputFocused={isInputFocused}
            />
          </div>
        </div>
      </Section>
    </Fragment>
  );
};

export default PreviewPosts;

const Section = styled.section`
  background: #fff;
  box-sizing: border-box;
  max-width: 375px;
  margin: 0px auto 1.25rem;
  padding: 0.5rem 1rem;
  background-color: #ececec;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  .post-header {
    height: 55px;
  }

  .post-container {
    position: relative;
    height: 100%;
    width: 100%;
    .img-post {
      width: 100%;
    }

    &::after {
      content: '';
      width: 100%;
      height: 100%;
      background-color: transparent;
      position: absolute;
      top: 0;
      left: 0;
      cursor: pointer;
      transition: background-color 250ms ease-in-out;
    }

    &:hover {
      &::after {
        background-color: #ffffff3e;
      }
    }
  }

  .post-details {
    padding: 0.8rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .caption-container {
    .caption-body {
      font-size: 0.8rem;
      padding-left: 0.3rem;
    }
    .more-btn {
      font-size: 0.8rem;
      color: var(--secondary-text);
      cursor: pointer;
    }
  }

  .comments-container {
    .view-comments {
      font-size: 0.8rem;
      color: var(--secondary-text);
      cursor: pointer;
    }
    .comment-body {
      margin-top: 1rem;
      display: flex;
    }
  }

  .time {
    padding-left: 1rem;
    color: var(--secondary-text);
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      padding: 0.2rem;
    }
  }

  .creator {
    font-size: 1rem;
    font-style: normal;
    font-weight: 700;
  }
`;

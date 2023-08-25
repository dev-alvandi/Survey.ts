import { ChangeEvent, FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { TbMessageCircle2 } from 'react-icons/tb';

import { PostSchemaTypes, editPost } from '../store/postSlice';
import Textarea from './Textarea';
import Button from './Button';
import { BASE_API_IMAGE_url, BASE_API_URL } from '../utils/api';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PostHeader from '../layouts/PostHeader';

interface PreviewPostsPropTypes {
  post: PostSchemaTypes;
  handleDeletedItem: (postId: string) => void;
}

const PreviewPosts: FC<PreviewPostsPropTypes> = ({
  post,
  handleDeletedItem,
}) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [numberOfLikes, setNumberOfLikes] = useState(post.likes.length);
  const [commentvalue, setCommentvalue] = useState('');
  const [isShowMore, setIsShowMore] = useState(false);
  const [isDisplaySetting, setIsDisplayShowSetting] = useState(false);
  const [isYourPost, setIsYourPost] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (post.creator._id === userId) {
      setIsYourPost(true);
    }
  }, []);

  const likeHandler = () => {
    const userId = localStorage.getItem('userId');
    const config = {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    };
    axios
      .put(
        `${BASE_API_URL}/feed/like-post?postId=${post._id}`,
        {
          userId: userId,
          isLiked: !isLiked,
        },
        config
      )
      .then((data) => {
        if (data.status === 201) {
          setNumberOfLikes(data.data.likes);
          setIsLiked((prevState) => !prevState);
        }
      })
      .catch((err) => console.log(err));
  };

  const editHandler = () => {
    dispatch(editPost({ isEditing: true, post: post }));
    navigate('/create-post');
  };

  const deletePostHandler = () => {
    const userId = localStorage.getItem('userId');
    const config = {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    };
    axios
      .delete(`${BASE_API_URL}/feed/delete-post/${post._id}`, config)
      .then((res) => {
        // console.log(res);
        if (res.status === 200) {
          handleDeletedItem(post._id);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDisplayingSettings = () => {
    setIsDisplayShowSetting((prevState) => !prevState);
  };

  const routingToComplePostHandler = () => {
    navigate(`/post/${post._id}`);
  };

  return (
    <Section>
      <div className="post-header">
        <PostHeader
          deletePostHandler={deletePostHandler}
          editHandler={editHandler}
          handleDisplayingSettings={handleDisplayingSettings}
          isDisplaySetting={isDisplaySetting}
          isYourPost={isYourPost}
          createdAt={post.created_at}
          creatorName={post.creator.name}
          imageSrc={`${BASE_API_IMAGE_url}/${post.creator.avatar}`}
        />
      </div>

      <div className="post-container">
        <img
          src={`${BASE_API_IMAGE_url}/${post.imageUrl}`}
          alt={post.title}
          className="img-post"
          onClick={routingToComplePostHandler}
        />
      </div>

      <div className="post-details">
        <div className="post-icons-container">
          {!isLiked && (
            <AiOutlineHeart className="icon" onClick={likeHandler} />
          )}
          {isLiked && (
            <AiFillHeart
              fill="#6643b5"
              className="icon"
              onClick={likeHandler}
            />
          )}

          <TbMessageCircle2 className="icon comment-icon" />
        </div>

        <div className="likes-container">
          <span className="likes">{numberOfLikes}</span>
          likes
        </div>

        <div className="caption-container">
          <span className="creator bold">{post.creator.name}</span>
          <span className="caption-body">
            {post.caption.length > 100 && !isShowMore
              ? `${post.caption.slice(0, 100)}...`
              : post.caption}
          </span>
          <div className="more-btn" onClick={() => setIsShowMore(!isShowMore)}>
            {post.caption.length > 100 ? (isShowMore ? 'less' : 'more') : ''}
          </div>
        </div>

        <div className="comments-container">
          <span className="view-comments">
            {post.comments && post.comments.length > 0
              ? `View all ${post.comments.length} comments`
              : 'No comment yet!'}
          </span>
          <div className="comment-body">
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
              <Button children="Post" isLoading={false} className={'btn'} />
            )}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default PreviewPosts;

const Section = styled.section`
  background: #fff;
  box-sizing: border-box;
  max-width: 375px;
  margin: 0px auto 1.25rem;
  padding: 0 1rem;
  background-color: #ececec;
  border-top: 1px solid #c6c6c6;

  .btn {
    background-color: transparent;
    color: #000;
    outline: none;
    &:hover {
      color: var(--primary-hover-blue);
    }
  }

  .textarea-container {
    width: 100%;
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
          border: none;
        }
      }
    }
  }

  .post-header {
    height: 55px;
    padding: 10px 0;
    box-sizing: border-box;
    display: flex;
  }

  .post-container {
    width: 100%;
    .img-post {
      width: 100%;
      cursor: pointer;
    }
  }

  .post-details {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    margin-top: 0.6rem;

    .post-icons-container {
      .icon {
        height: 23px;
        width: 23px;
        margin-right: 1rem;
        cursor: pointer;
      }
      .comment-icon {
        transform: rotateY(180deg);
      }
    }
    .likes-container {
      font-family: sans-serif;
      font-weight: 600;
      font-size: 0.9rem;
      display: flex;
      gap: 0.2rem;
    }
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
  }

  .bold {
    font-style: normal;
    font-weight: 700;
  }
`;

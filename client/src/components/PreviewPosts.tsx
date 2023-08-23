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
    // console.log(post);
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
        console.log(res);
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

  return (
    <Section>
      <div className="post-header">
        <img
          src={`${BASE_API_IMAGE_url}/${post.imageUrl}`}
          alt={post.creator.name}
          className="img-avtar"
        />
        <div className="creator-details">
          <span className="creator bold">{post.creator.name}</span>
          <div className="creator-details__extra-info">
            <time dateTime={post.created_at!.toString()} className="time">
              {new Date(post.created_at!).toLocaleDateString('sv-SE', {
                month: 'short',
                day: 'numeric',
              })}
              &nbsp;-&nbsp;
              {new Date(post.created_at!).toLocaleTimeString('sv-SE', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </time>
            {isYourPost && (
              <div className="post-settings" onClick={handleDisplayingSettings}>
                <div className="setting-dots" />
                {isDisplaySetting && (
                  <div className="post-settings__items">
                    <div className="edit" onClick={editHandler}>
                      Edit
                    </div>
                    <div className="delete" onClick={deletePostHandler}>
                      Delete
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="post-container">
        <img
          src={`${BASE_API_IMAGE_url}/${post.imageUrl}`}
          alt={post.title}
          className="img-post"
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
    .img-avtar {
      height: 100%;
      width: auto;
      aspect-ratio: 1 / 1;
      border-radius: 50%;
      object-fit: cover;
    }
    .creator-details {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      padding-left: 0.5rem;
      .creator-details__extra-info {
        display: flex;
        gap: 0.7rem;
        .post-settings {
          padding: 0.9rem;
          position: relative;
          border-radius: 50%;
          /* border: 1px solid #000; */
          cursor: pointer;
          transition: 200ms background-color ease-in-out;
          .setting-dots {
            &:hover {
              background-color: #fff;
            }
            --dot-size: 0.2rem;
            --dot-color: ;
            width: var(--dot-size);
            height: var(--dot-size);
            border-radius: 50%;
            background-color: #000;
            &::after,
            &::before {
              content: '';
              width: var(--dot-size);
              height: var(--dot-size);
              border-radius: 50%;
              background-color: #000;
              position: absolute;
              top: 25%;
              transform: translateY(-50%);
            }
            &::after {
              /* top: 100%;
              transform: translateY(-100%); */
              top: 75%;
            }
          }
          .post-settings__items {
            position: absolute;
            top: 100%;
            right: 0;
            background-color: #ffffff;
            .edit,
            .delete {
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 0.5rem 1rem;
              transition: 200ms all ease-in-out;
              &:hover {
                background-color: var(--primary-purple);
                color: #fff;
              }
            }
          }
        }
      }
    }
  }

  .post-container {
    width: 100%;
    .img-post {
      width: 100%;
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

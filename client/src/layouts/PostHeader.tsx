import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

import { BASE_API_IMAGE_url } from '../utils/api';
import { PostSchemaTypes } from '../store/postSlice';
import dateFormatter from '../utils/dateFormatter';
import PostDeleteUpdate from './PostDeleteUpdate';

interface PropTypes {
  post: PostSchemaTypes;
  handleDeletedItem?: (postId: string) => void;
  extraClassName?: string;
}

const PostHeader: FC<PropTypes> = ({
  post,
  handleDeletedItem,
  extraClassName,
}) => {
  const [isYourPost, setIsYourPost] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (post.creator._id === userId) {
      setIsYourPost(true);
    }
  }, [post.creator._id]);

  return (
    <Container className={extraClassName}>
      <img
        src={`${BASE_API_IMAGE_url}/${post.creator.avatar}`}
        alt={post.creator.name}
        className="img-avtar"
      />
      <div className="creator-details__container">
        <span className="creator bold">{post.creator.name}</span>
        <div className="creator-details__extra-info">
          <time dateTime={post.created_at!.toString()} className="time">
            {post.created_at && dateFormatter(post.created_at)}
          </time>
          {isYourPost && (
            <PostDeleteUpdate
              handleDeletedItem={handleDeletedItem}
              post={post}
            />
          )}
        </div>
      </div>
    </Container>
  );
};

export default PostHeader;

const Container = styled.div`
  height: var(--creator-avatar-size);
  /* padding: 10px 0; */
  display: flex;
  align-items: center;
  justify-content: center;

  .img-avtar {
    height: 100%;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    object-fit: cover;
  }

  .creator-details__container {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    padding-left: 0.5rem;
    .creator {
      font-size: 1rem;
      font-style: normal;
      font-weight: 700;
    }
    .creator-details__extra-info {
      display: flex;
      gap: 0.7rem;
      .time {
        display: flex;
        align-items: center;
      }
    }
  }
`;

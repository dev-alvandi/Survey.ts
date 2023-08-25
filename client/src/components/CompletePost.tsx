import styled from 'styled-components';
import { PostSchemaTypes } from '../store/postSlice';
import { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_API_IMAGE_url, BASE_API_URL } from '../utils/api';
import PostHeader from '../layouts/PostHeader';

const CompletePost = () => {
  const params = useParams();

  const [post, setPost] = useState<PostSchemaTypes>();

  console.log(post);

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
  }, []);

  return (
    <Container>
      {post && (
        <Fragment>
          <div className="post-image">
            <img src={`${BASE_API_IMAGE_url}/${post.imageUrl}`} alt="" />
          </div>
          <div className="post-details">
            <div className="post-creator">
              {/* <PostHeader
                deletePostHandler={deletePostHandler}
                editHandler={editHandler}
                handleDisplayingSettings={handleDisplayingSettings}
                isDisplaySetting={isDisplaySetting}
                isYourPost={isYourPost}
                createdAt={post.created_at}
                creatorName={post.creator.name}
                imageSrc={`${BASE_API_IMAGE_url}/${post.creator.avatar}`}
              /> */}
            </div>
            <div className="comments-container"></div>
            <div className="post-actions"></div>
            <div className="comment-form"></div>
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
  height: calc(100vh - 4rem);
  padding: 3rem 4rem 3rem 4rem;
  border: 1px solid #000;
  position: relative;
  border-radius: 0.2rem;
  display: flex;

  .post-image {
    width: var(--image-container-width);
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .post-details {
    width: calc(100% - var(--image-container-width));
    border: 1px solid #000;
  }
`;

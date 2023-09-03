import styled from 'styled-components';

const LoadingPreviwPosts = () => {
  return (
    <Section>
      <div className="post-header">
        <div className="mock-avatar" />
        <div className="mock-name" />
      </div>

      <div className="post-container">
        {/* <img
          src={`${BASE_API_IMAGE_url}/${post.imageUrl}`}
          alt={post.title}
          className="img-post"
          onClick={routingToComplePostHandler}
        /> */}
        <div className="mock-postImage" />
      </div>
    </Section>
  );
};

export default LoadingPreviwPosts;

const Section = styled.section`
  --loader-background-color: #eeeeee;
  --loader-highlight-color: #dedede;

  background: #fff;
  box-sizing: border-box;
  max-width: 375px;
  width: 100%;
  height: 35rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 0px auto 1.25rem;
  padding: 0.5rem 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #fff;

  .post-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    height: 55px;
    .mock-avatar {
      width: 55px;
      height: 55px;
      border-radius: 50%;
      cursor: pointer;
      background: linear-gradient(
        90deg,
        var(--loader-background-color) 25%,
        var(--loader-highlight-color) 50%,
        var(--loader-background-color) 75%
      );
      background-color: #fff;
      background-size: 200% 100%;
      animation: loading 3s ease-in-out infinite;
    }
    .mock-name {
      width: 80%;
      height: 70%;
      background-color: #fff;
      background: linear-gradient(
        90deg,
        var(--loader-background-color) 25%,
        var(--loader-highlight-color) 50%,
        var(--loader-background-color) 75%
      );
      background-size: 200% 100%;
      animation: loading 3s ease-in-out infinite;
    }
  }

  .post-container {
    width: 100%;
    height: 100%;
    .mock-postImage {
      width: 100%;
      height: 95%;
      cursor: pointer;
      background: linear-gradient(
        90deg,
        var(--loader-background-color) 25%,
        var(--loader-highlight-color) 50%,
        var(--loader-background-color) 75%
      );
      background-size: 200% 100%;
      animation: loading 3s ease-in-out infinite;
    }
  }
  @keyframes loading {
    0% {
      background-position: 200% 100%;
    }
    100% {
      background-position: -200% 100%;
    }
  }
`;

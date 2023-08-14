import React, { FC, Fragment } from 'react';

interface PreviewPostsPropTypes {
  post: {
    _id: string;
    title: string;
    imageUrl: string;
    caption: string;
  };
}

const PreviewPosts: FC<PreviewPostsPropTypes> = ({ post }) => {
  return (
    <div className="post-container">
      <div className="title">
        <h3>{post.title}</h3>
      </div>
      <div className="image">
        <img src={post.imageUrl} alt={post.title} />
      </div>
      <div className="Caption">
        <p>{post.caption}</p>
      </div>
    </div>
  );
};

export default PreviewPosts;

const numberOfLikesText = (likes: number) => {
  if (likes === 0 || likes === 1) {
    return `${likes} like`;
  } else if (likes > 1) {
    return `${likes} likes`;
  }
};

export default numberOfLikesText;

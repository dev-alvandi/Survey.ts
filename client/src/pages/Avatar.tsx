import styled from 'styled-components';
import ImageUploader from '../components/ImageUploader';
import SingleFileUploader from '../components/SingleFileUploader';
import { FormEvent, useState } from 'react';
import Button from '../components/Button';
import axios from 'axios';
import { BASE_API_URL } from '../utils/api';
import { useLocation, useNavigate } from 'react-router-dom';

const Avatar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  console.log(location);

  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onChangeUploadHandler = (e: any) => {
    const imageFile = e.target.files[0];
    setAvatarUrl(URL.createObjectURL(imageFile));
    setAvatar(imageFile);
  };

  const onDropUploadHandler = (e: any) => {
    e.preventDefault();
    const imageFile = e?.dataTransfer?.files[0];
    setAvatarUrl(URL.createObjectURL(imageFile));
    setAvatar(imageFile);
  };

  const removeUploadedImgHandler = (e: any) => {
    setAvatar('');
    setAvatarUrl('');
  };

  const avatarSubmitHandler = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const userId = location.state.userId;

    //! Submitting the avatar!
    const formData = new FormData();
    formData.append('avatar', avatar);
    if (location.pathname === '/"/edit-avatar"') {
      formData.append('isEditing', 'true');
    }

    const config = {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    };

    axios
      .put(`${BASE_API_URL}/auth/set-avatar/${userId}`, formData, config)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 201) {
          navigate('/login');
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };
  return (
    <Container className="pageContainer">
      <div className="title">
        <h1>Please upload your profile picture.</h1>
      </div>
      <form onSubmit={avatarSubmitHandler}>
        <div className="imageUploader">
          {!avatarUrl ? (
            <SingleFileUploader
              onChangeUploadHandler={onChangeUploadHandler}
              onDropUploadHandler={onDropUploadHandler}
              removeUploadedImgHandler={removeUploadedImgHandler}
            />
          ) : (
            <ImageUploader
              image={{
                url: avatarUrl,
                name: 'This',
              }}
              removeUploadedImgHandler={removeUploadedImgHandler}
            />
          )}
        </div>
        <div className="button-container">
          <Button type="submit" isLoading={isLoading}>
            Submit
          </Button>
        </div>
      </form>
    </Container>
  );
};

export default Avatar;

const Container = styled.div`
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    align-items: center;
    .button-container {
    }
  }
`;

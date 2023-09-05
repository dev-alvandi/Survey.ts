import styled from 'styled-components';
import { FormEvent, Fragment, useState } from 'react';
import Button from '../components/Button';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useAppDispatch } from '../store/store';

import ImageUploader from '../components/ImageUploader';
import SingleFileUploader from '../components/SingleFileUploader';
import { BASE_API_URL } from '../utils/api';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import toastOptions from '../utils/toastOptions';
import { changeAvatar } from '../store/userSlice';

const Avatar = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();

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

    //! Submitting the avatar!
    const formData = new FormData();
    formData.append('avatar', avatar);
    if (location.pathname === '/edit-avatar') {
      formData.append('isEditing', 'true');
    }

    const config = {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    };
    axios
      .put(`${BASE_API_URL}/auth/set-avatar/${user._id}`, formData, config)
      .then((res) => {
        setIsLoading(false);
        if (res.status === 201) {
          dispatch(changeAvatar(res.data.image));
          navigate('/login');
        }
      })
      .catch(({ response }) => {
        setIsLoading(false);
        if (response.data.data) {
          response.data.data.forEach((errMsg: string) => {
            toast.error(errMsg, toastOptions);
          });
        }
      });
  };
  return (
    <Fragment>
      <ToastContainer />
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
    </Fragment>
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

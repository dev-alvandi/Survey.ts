import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/store';
import { useDispatch } from 'react-redux';

import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Button from '../components/Button';
import ImageUploader from '../components/ImageUploader';
import { BASE_API_IMAGE_url, BASE_API_URL } from '../utils/api';
import axios from 'axios';
import ServerMessage from '../components/ServerMessage';
import SingleFileUploader from '../components/SingleFileUploader';
import { editPost, resetPostValue } from '../store/postSlice';

interface ValueStateTypes {
  image: any;
  title: string;
  caption: string;
}

interface serverMessageProps {
  text: string;
  type: 'error' | 'success' | 'info';
}

export default function CreatePost() {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  const isEditing = useAppSelector((state) => state.editPost.isEditing);
  const post = useAppSelector((state) => state.editPost.post);

  const [values, setValues] = useState<ValueStateTypes>({
    image: {},
    title: '',
    caption: '',
  });
  const [imageUrl, setImageUrl] = useState('');
  const [serverMessage, setServerMessage] = useState<serverMessageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  console.log(isEditing);

  useEffect(() => {
    if (isEditing) {
      setValues((prevState) => ({
        ...prevState,
        image: post.imageUrl,
        title: post.title,
        caption: post.caption,
      }));

      setImageUrl(`${BASE_API_IMAGE_url}/${post.imageUrl}`);
    }
  }, []);

  //* Cleanup after leaving the page!
  useEffect(() => {
    if (location.pathname !== '/create-post') {
      dispatch(editPost({ isEditing: false, post: { ...resetPostValue } }));
    }
  }, [location]);

  const onChangeUploadHandler = (e: any) => {
    const imageFile = e.target.files[0];
    setImageUrl(URL.createObjectURL(imageFile));
    setValues((prevState) => ({
      ...prevState,
      image: imageFile,
    }));
  };

  const onDropUploadHandler = (e: any) => {
    e.preventDefault();
    const imageFile = e?.dataTransfer?.files[0];
    setImageUrl(URL.createObjectURL(imageFile));
    setValues((prevState) => ({
      ...prevState,
      image: imageFile,
    }));
  };

  const removeUploadedImgHandler = (e: any) => {
    setValues((prevState) => ({ ...prevState, image: undefined }));
    setImageUrl('');
  };

  const formSubmitHanlder = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    //! check exiparion of token on both sides!
    const creatorId = localStorage.getItem('userId')!;

    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('caption', values.caption);
    // formData.append('image', imageBase64);
    formData.append('image', values.image);
    formData.append('creatorId', creatorId);

    let fetchingconfig = {
      method: 'POST',
      url: `${BASE_API_URL}/feed/create-post`,
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    };

    if (isEditing) {
      fetchingconfig = {
        method: 'PUT',
        url: `${BASE_API_URL}/feed/edit-post/${post._id}`,
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      };
      if (!values.image) {
        formData.append('image', imageUrl);
      }
    }

    axios({
      method: fetchingconfig.method,
      url: fetchingconfig.url,
      data: formData,
      headers: fetchingconfig.headers,
    })
      .then((res) => {
        if (res.status === 201 || res.status === 200) {
          setServerMessage([{ text: res.data.msg, type: 'success' }]);
          if (isEditing) {
            dispatch(
              editPost({ isEditing: false, post: { ...resetPostValue } })
            );
          }
          setIsLoading(true);
          navigate('/');
        }
      })
      .catch((response) => {
        // .catch(({ response }) => {
        setIsLoading(false);
        console.log(response);
        // const errArray: serverMessageProps[] = [];
        // response.data.data.forEach((errObj: { msg: string }) => {
        //   errArray.push({ text: errObj.msg, type: 'error' });
        // });
        // setServerMessage(errArray);
      });
  };

  return (
    <Container className="pageContainer">
      <form onSubmit={formSubmitHanlder}>
        <ServerMessage messageArray={serverMessage} />
        {!imageUrl ? (
          <SingleFileUploader
            onChangeUploadHandler={onChangeUploadHandler}
            onDropUploadHandler={onDropUploadHandler}
            removeUploadedImgHandler={removeUploadedImgHandler}
          />
        ) : (
          <ImageUploader
            image={{
              url: imageUrl,
              name: 'This',
            }}
            removeUploadedImgHandler={removeUploadedImgHandler}
          />
        )}
        <Input
          id="title"
          label="Title"
          value={values.title}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValues((prevState) => ({ ...prevState, title: e.target.value }))
          }
        />
        <Textarea
          id="text"
          label="Caption"
          value={values.caption}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setValues((prevState) => ({
              ...prevState,
              caption: e.target.value,
            }))
          }
        />
        <Button type="submit" isLoading={isLoading}>
          {isEditing ? 'Edit Post' : 'Post Now!'}
        </Button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  form {
    width: 50%;
  }
`;

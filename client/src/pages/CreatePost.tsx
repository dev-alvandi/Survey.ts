import { ChangeEvent, FormEvent, useState, DragEvent } from 'react';

import styled from 'styled-components';

import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Button from '../components/Button';
import Slider from '../components/Slider';
import { BASE_API_URL } from '../utils/api';
import axios from 'axios';
import ServerMessage from '../components/ServerMessage';
import { useNavigate } from 'react-router-dom';
import SingleFileUploader from '../components/SingleFileUploader';
import { convertBase64 } from '../utils/convertBase64';

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
  const navigate = useNavigate();
  const [values, setValues] = useState<ValueStateTypes>({
    image: '',
    title: '',
    caption: '',
  });
  const [blobTypeImage, setBlobTypeImage] = useState<Blob>();

  const [serverMessage, setServerMessage] = useState<serverMessageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const onChangeUploadHandler = (e: any) => {
    const imageFile = e.target.files[0];
    setBlobTypeImage(imageFile);
    setValues((prevState) => ({
      ...prevState,
      image: URL.createObjectURL(imageFile),
    }));
  };

  const onDropUploadHandler = (e: any) => {
    e.preventDefault();
    const imageFile = e?.dataTransfer?.files[0];
    setBlobTypeImage(imageFile);
    setValues((prevState) => ({
      ...prevState,
      image: URL.createObjectURL(imageFile),
    }));
  };

  const removeUploadedImgHandler = (e: any) => {
    setValues((prevState) => ({ ...prevState, image: undefined }));
  };

  const formSubmitHanlder = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    //! check exiparion of token on both sides!
    const creatorId = localStorage.getItem('userId');

    // if (blobTypeImage) {
    //   render.readAsDataURL(blobTypeImage);
    // }
    // render.onload = (renderEvent: any) => {
    // };

    // const formData = new FormData();
    // if (blobTypeImage) {
    //   formData.append('imageUrl', blobTypeImage);
    // }
    const imageBase64 = await convertBase64(blobTypeImage);
    axios
      .post(`${BASE_API_URL}/feed/create-post`, {
        title: values.title,
        caption: values.caption,
        imageUrl: imageBase64,
        creatorId: creatorId,
      })
      .then((res) => {
        console.log(res);
        if (res.status === 201) {
          console.log(res.data);
          setServerMessage([{ text: res.data.msg, type: 'success' }]);
          setTimeout(() => {
            setIsLoading(true);
            navigate('/');
          }, 500);
        }
      })
      // .catch(({ response }) => {
      .catch((response) => {
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
        {!values.image ? (
          <SingleFileUploader
            onChangeUploadHandler={onChangeUploadHandler}
            onDropUploadHandler={onDropUploadHandler}
            removeUploadedImgHandler={removeUploadedImgHandler}
          />
        ) : (
          <Slider
            image={{ url: values.image, name: 'This' }}
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
          Post Now!
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

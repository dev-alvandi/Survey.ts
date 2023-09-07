import { ChangeEvent, FormEvent, Fragment, useReducer, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';

import Input from '../components/Input';
import Button from '../components/Button';
import { BASE_API_URL } from '../utils/api';
import toastOptions from '../utils/toastOptions';

enum ACTION {
  NAME = 'name',
  EMAIL = 'email',
  PASSWORD = 'password',
  CONFIRM_PASSWORD = 'confirmPassword',
}

type ActionType = {
  type: ACTION;
  payload: string;
};

interface serverMessageProps {
  text: string;
  type: 'error' | 'success' | 'info';
}

const reducer = (state: any, action: ActionType) => {
  switch (action.type) {
    case ACTION.NAME:
      return { ...state, name: action.payload };
    case ACTION.EMAIL:
      return { ...state, email: action.payload };
    case ACTION.PASSWORD:
      return { ...state, password: action.payload };
    case ACTION.CONFIRM_PASSWORD:
      return { ...state, confirmPassword: action.payload };
    default:
      throw new Error('A wrong action type is passed!');
  }
};

// const pause = () => new Promise((resolve) => setTimeout(resolve, 100));

const Register = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const formSubmitHandler = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .put(`${BASE_API_URL}/auth/register`, { ...state })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          console.log(res.data);
          toast.success(res.data.msg, toastOptions);
          // setTimeout(() => {
          setIsLoading(true);
          navigate('/avatar', {
            state: {
              userId: res.data.newUser._id,
            },
          });
          // }, 500);
        }
      })
      .catch(({ response }) => {
        setIsLoading(false);
        const errArray: serverMessageProps[] = [];
        if (response.data.data) {
          response.data.data.forEach((errMsg: string) => {
            toast.error(errMsg, toastOptions);
          });
        }
      });
  };

  const inputChangeHandler = (type: ACTION, payload: string) => {
    dispatch({ type, payload });
  };

  return (
    <Fragment>
      <ToastContainer />
      <Container className="pageContainer">
        <form onSubmit={formSubmitHandler} className="inputBody">
          <Input
            id="name-register"
            label="Name"
            type="text"
            value={state.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              inputChangeHandler(ACTION.NAME, e.target.value)
            }
          />
          <Input
            id="email-register"
            label="Email"
            type="email"
            value={state.email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              inputChangeHandler(ACTION.EMAIL, e.target.value)
            }
          />
          <Input
            id="pass-register"
            label="Password"
            type="password"
            value={state.password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              inputChangeHandler(ACTION.PASSWORD, e.target.value)
            }
          />
          <Input
            id="rePass"
            label="Confirm Password"
            type="password"
            value={state.confirmPassword}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              inputChangeHandler(ACTION.CONFIRM_PASSWORD, e.target.value)
            }
          />
          <Button isLoading={isLoading}>Sign up</Button>
        </form>
      </Container>
    </Fragment>
  );
};

const Container = styled.div``;

export default Register;

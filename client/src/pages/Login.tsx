import {
  ChangeEvent,
  FormEvent,
  Fragment,
  useCallback,
  useReducer,
  useState,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';

import Input from '../components/Input';
import Button from '../components/Button';
import { BASE_API_URL } from '../utils/api';
import { useAppDispatch } from '../store/store';
import { login } from '../store/userSlice';
import toastOptions from '../utils/toastOptions';

enum ACTION {
  EMAIL = 'email',
  PASSWORD = 'password',
}

type ActionType = {
  type: ACTION;
  payload: string;
};

const reducer = (state: any, action: ActionType) => {
  switch (action.type) {
    case ACTION.EMAIL:
      return { ...state, email: action.payload };
    case ACTION.PASSWORD:
      return { ...state, password: action.payload };
    default:
      throw new Error('A wrong action type is passed!');
  }
};

const Login = () => {
  const navigate = useNavigate();
  const dispatchRedux = useAppDispatch();
  const [state, dispatch] = useReducer(reducer, {
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const formSubmitHandler = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .post(`${BASE_API_URL}/auth/login`, { ...state })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          toast.success(res.data.msg, toastOptions);
          setIsLoading(true);
          const { user, token } = res.data;
          localStorage.setItem('token', token);
          localStorage.setItem('userId', user._id);
          const remainingMilliseconds = 60 * 60 * 1000;
          const expiryDate = new Date(
            new Date().getTime() + remainingMilliseconds
          );
          localStorage.setItem('expiryDate', expiryDate.toISOString());
          dispatchRedux(login({ user: user, isAuth: true }));
          navigate('/');
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

  const inputChangeHandler = useCallback((type: ACTION, payload: string) => {
    dispatch({ type, payload });
  }, []);
  return (
    <Fragment>
      <ToastContainer />
      <Container className="pageContainer">
        <form onSubmit={formSubmitHandler} className="inputBody">
          <Input
            id="email"
            label="Email"
            type="email"
            value={state.email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              inputChangeHandler(ACTION.EMAIL, e.target.value)
            }
          />
          <Input
            id="pass"
            label="Password"
            type="password"
            value={state.password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              inputChangeHandler(ACTION.PASSWORD, e.target.value)
            }
          />
          <div className="button-container">
            <Button isLoading={isLoading}>Login</Button>
            <Link to="/login/forgottenpassword">Forgot Password?</Link>
          </div>
        </form>
      </Container>
    </Fragment>
  );
};

const Container = styled.div`
  .button-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    a {
      color: #000;
      transition: color 0.15s ease-in-out;
      &:hover {
        color: var(--primary-purple);
      }
    }
  }
`;

export default Login;

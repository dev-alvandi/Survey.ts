import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

import Input from '../components/Input';
import Button from '../components/Button';
import { BASE_API_URL } from '../utils/api';
import { useAppDispatch } from '../store/store';
import { toAuth } from '../store/userSlice';
import ServerMessage from '../components/ServerMessage';

enum ACTION {
  EMAIL = 'email',
  PASSWORD = 'password',
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
  const [serverMessage, setServerMessage] = useState<serverMessageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const formSubmitHandler = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .post(`${BASE_API_URL}/auth/login`, { ...state })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setServerMessage([{ text: res.data.msg, type: 'success' }]);
          const timer = setTimeout(() => {
            setIsLoading(true);
            const { user } = res.data;
            localStorage.setItem('token', user.token);
            localStorage.setItem('userId', user.userId);
            localStorage.setItem('userName', user.name);
            const remainingMilliseconds = 60 * 60 * 1000;
            const expiryDate = new Date(
              new Date().getTime() + remainingMilliseconds
            );
            localStorage.setItem('expiryDate', expiryDate.toISOString());

            dispatchRedux(toAuth({ ...user, isAuth: true }));
            navigate('/');
          }, 500);
        }
      })
      .catch(({ response }) => {
        setIsLoading(false);
        const errArray: serverMessageProps[] = [];
        response.data.data.forEach((errObj: { msg: string }) => {
          errArray.push({ text: errObj.msg, type: 'error' });
        });
        setServerMessage(errArray);
      });
  };

  const inputChangeHandler = useCallback((type: ACTION, payload: string) => {
    dispatch({ type, payload });
  }, []);
  return (
    <Container className="pageContainer">
      <form onSubmit={formSubmitHandler} className="inputBody">
        <ServerMessage messageArray={serverMessage} />
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

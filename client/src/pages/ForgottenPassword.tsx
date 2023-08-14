import styled from 'styled-components';
import { ChangeEvent, FormEvent, useState } from 'react';

import Input from '../components/Input';
import Button from '../components/Button';
import axios from 'axios';
import { BASE_API_URL } from '../utils/api';
import { useAppDispatch, useAppSelector } from '../store/store';
import { addResetToken } from '../store/userSlice';

const ForgottenPassword = () => {
  const dispatch = useAppDispatch();
  const resetToken = useAppSelector((state) => state.resetToken.resetToken);

  const [email, setEmail] = useState('');
  const [fetchInfo, setFetchInfo] = useState({
    msg: '',
    styleName: '',
  });

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();

    axios
      .post(
        `${BASE_API_URL}/auth/forgottenpassword`,
        { email: email.toLowerCase() },
        {
          withCredentials: true,
        }
      )
      .then(({ data }) => {
        if (data.status === 200) {
          dispatch(addResetToken(data.token));
          console.log(resetToken);
          return setFetchInfo({
            msg: data.msg,
            styleName: 'success-message',
          });
        }
        setFetchInfo({ msg: data.msg, styleName: 'error-message' });
      })
      .catch((err) => console.log(err));
  };

  return (
    <Container className="pageContainer">
      <div className="inner-container">
        {fetchInfo.msg !== '' && (
          <div className={`message-container  ${fetchInfo.styleName}`}>
            <span>{fetchInfo.msg}</span>
          </div>
        )}
        <div className="text">
          <h2>Forgot your password?</h2>
          <p>
            If you have forgotten your password, please enter your email with
            which you sign up into your account. Thereafter, reset your password
            using the sent link in your mailbox.
          </p>
        </div>
        <form onSubmit={submitHandler} className="inputBody">
          <Input
            id="ForgottenPassword"
            label="Email"
            type="email"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            value={email}
          />
          {/* <Button>Send Email</Button> */}
        </form>
      </div>
    </Container>
  );
};

const Container = styled.div`
  .inner-container {
    width: 30rem;
    p {
      width: 100%;
      text-align: justify;
    }
  }
`;

export default ForgottenPassword;

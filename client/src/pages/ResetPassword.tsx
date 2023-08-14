import { ChangeEvent, FormEvent, useState } from 'react';
import styled from 'styled-components';
import Input from '../components/Input';
import Button from '../components/Button';
import axios from 'axios';
import { BASE_API_URL } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    rePassword: '',
    confirmRePassword: '',
  });
  const [fetchInfo, setFetchInfo] = useState({ msg: '', styleName: '' });
  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.rePassword === inputValue.confirmRePassword) {
      axios
        .post(
          `${BASE_API_URL}/auth/new-password`,
          { ...inputValue },
          { withCredentials: true }
        )
        .then(({ data }) => {
          if (data.status === 200) {
            setFetchInfo({
              msg: data.msg,
              styleName: 'success-message',
            });
            return navigate('/login');
          }
          setFetchInfo({ msg: data.msg, styleName: 'error-message' });
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <Container className="pageContainer">
      {fetchInfo.msg !== '' && (
        <div className={`message-container  ${fetchInfo.styleName}`}>
          <span>{fetchInfo.msg}</span>
        </div>
      )}
      <div className="text">
        <h2>Set a new password</h2>
      </div>
      <form onSubmit={submitHandler} className="inputBody">
        <Input
          id="resetPassword"
          label="Re-password"
          type="password"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setInputValue((prevState) => ({
              ...prevState,
              rePassword: e.target.value,
            }))
          }
          value={inputValue.rePassword}
        />
        <Input
          id="confirmResetPassword"
          label="Confirm Re-password"
          type="password"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setInputValue((prevState) => ({
              ...prevState,
              confirmRePassword: e.target.value,
            }))
          }
          value={inputValue.confirmRePassword}
        />
        {/* <Button>Reset Password</Button> */}
      </form>
    </Container>
  );
};

const Container = styled.div``;
export default ResetPassword;

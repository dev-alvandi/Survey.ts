import { useEffect, useState } from 'react';

import { toAuth, unAuth } from '../store/userSlice';
import { useAppDispatch, useAppSelector } from '../store/store';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const expiryDate = localStorage.getItem('expiryDate');

    if (!token || !expiryDate) {
      return;
    }
    if (new Date(expiryDate) <= new Date()) {
      logoutHandler();
      return;
    }
    const userId = localStorage.getItem('userId') || '';
    const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime();
    dispatch(
      toAuth({
        isAuth: true,
        authToken: token,
        userId: userId,
      })
    );
    setAutoLogout(remainingMilliseconds);
  }, []);

  const setAutoLogout = (milliseconds: number) => {
    setTimeout(() => {
      logoutHandler();
    }, milliseconds);
  };

  const logoutHandler = () => {
    dispatch(unAuth());
    localStorage.removeItem('token');
    localStorage.removeItem('expiryDate');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return {
    user,
    logoutHandler,
  };
};

export default useAuth;

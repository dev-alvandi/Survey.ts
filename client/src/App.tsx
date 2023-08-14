import { Fragment, useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';

import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import CreatePost from './pages/CreatePost';
import Home from './pages/Home';
import MyPosts from './pages/MyPosts';
import { useAppDispatch, useAppSelector } from './store/store';
import { toAuth, unAuth } from './store/userSlice';
import ForgottenPassword from './pages/ForgottenPassword';
import ResetPassword from './pages/ResetPassword';
import useAuth from './hooks/useAuth';

function App() {
  const dispatch = useAppDispatch();
  // const user = useAppSelector((state) => state.auth.user);
  const resetToken = useAppSelector((state) => state.resetToken.resetToken);

  const [willChangePassword, setWillChangePassword] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  const { user, logoutHandler } = useAuth();

  return (
    <Fragment>
      <Navbar isLogged={user.isAuth} logoutHandler={logoutHandler} />
      <Routes>
        <Route
          path="/register"
          element={!user.isAuth ? <Register /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!user.isAuth ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/login/forgottenpassword"
          element={!user.isAuth ? <ForgottenPassword /> : <Navigate to="/" />}
        />
        <Route
          path="/create-post"
          element={user.isAuth ? <CreatePost /> : <Navigate to="/login" />}
        />
        <Route
          path="/myposts"
          element={user.isAuth ? <MyPosts /> : <Navigate to="/login" />}
        />
        {willChangePassword && (
          <Route
            path={`/new-password/${resetToken}`}
            element={<ResetPassword />}
          />
        )}
        <Route path="/" element={<Home />} />
      </Routes>
    </Fragment>
  );
}

export default App;

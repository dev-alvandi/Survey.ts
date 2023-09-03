import { Fragment } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import CreatePost from './pages/CreatePost';
import Home from './pages/Home';
import MyPosts from './pages/MyPosts';
import ForgottenPassword from './pages/ForgottenPassword';
// import ResetPassword from './pages/ResetPassword';
import useAuth from './hooks/useAuth';
import Avatar from './pages/Avatar';
import CompletePost from './components/CompletePost';

function App() {
  const { user, logoutHandler, isAuth } = useAuth();

  return (
    <Fragment>
      <Navbar user={user} isAuth={isAuth} logoutHandler={logoutHandler} />
      <Routes>
        <Route
          path="/register"
          element={!isAuth ? <Register /> : <Navigate to="/" />}
        />
        <Route
          path="/avatar"
          element={!isAuth ? <Avatar /> : <Navigate to="/" />} //! incorrectly protected!
        />
        <Route
          path="/edit-avatar"
          element={isAuth ? <Avatar /> : <Navigate to="/" />} //! incorrectly protected!
        />
        <Route
          path="/login"
          element={!isAuth ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/login/forgottenpassword"
          element={!isAuth ? <ForgottenPassword /> : <Navigate to="/" />}
        />
        <Route
          path="/create-post"
          element={isAuth ? <CreatePost /> : <Navigate to="/login" />}
        />
        <Route
          path="/myposts"
          element={isAuth ? <MyPosts /> : <Navigate to="/login" />}
        />
        {/* {willChangePassword && (
          <Route
            path={`/new-password/${resetToken}`}
            element={<ResetPassword />}
          />
        )} */}
        <Route path="/" element={<Home />} />
        <Route path="/post/:postId" element={<CompletePost />} />
      </Routes>
    </Fragment>
  );
}

export default App;

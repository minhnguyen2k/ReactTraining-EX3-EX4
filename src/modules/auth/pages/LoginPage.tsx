import { replace } from 'connected-react-router';
import Cookies from 'js-cookie';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { API_PATHS } from '../../../configs/api';
import loginStyle from '../scss/Auth.module.scss';
import { ROUTES } from '../../../configs/routes';
import logo from '../../../logo-420-x-108.png';
import { ILoginParams } from '../../../models/auth';
import { AppState } from '../../../redux/reducer';
import { getErrorMessageResponse } from '../../../utils';
import { ACCESS_TOKEN_KEY } from '../../../utils/constants';
import { RESPONSE_STATUS_SUCCESS } from '../../../utils/httpResponseCode';
import { fetchThunk } from '../../common/redux/thunk';
import LoginForm from '../components/LoginForm';
import { setUserInfo } from '../redux/authReducer';
import { Link } from 'react-router-dom';

const LoginPage: FC = () => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const [errorMessage, setErrorMessage] = useState('');
  const handleLogin = React.useCallback(
    async (values: ILoginParams) => {
      setErrorMessage('');

      const json = await dispatch(
        fetchThunk(API_PATHS.signIn, 'post', { email: values.email, password: values.password }),
      );

      if (json?.code === RESPONSE_STATUS_SUCCESS) {
        dispatch(setUserInfo(json.data));
        Cookies.set(ACCESS_TOKEN_KEY, json.data.token, { expires: values.rememberMe ? 7 : undefined });
        dispatch(replace(ROUTES.home));
        return;
      }

      setErrorMessage(getErrorMessageResponse(json));
    },
    [dispatch],
  );
  return (
    <div className={loginStyle.container}>
      <img src={logo} alt="" className={loginStyle.logo} />
      <LoginForm onLogin={handleLogin} errorMessage={errorMessage} />
      <Link to="/sign-up">Sign Up</Link>
    </div>
  );
};
export default LoginPage;

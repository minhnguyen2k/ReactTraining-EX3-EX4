import React, { FC, useCallback, useEffect, useState } from 'react';
import SignUpForm from '../components/SignUpForm';
import SignUpStyle from '../scss/Auth.module.scss';
import logo from '../../../logo-420-x-108.png';
import { fetchThunk } from '../../common/redux/thunk';
import { API_PATHS } from '../../../configs/api';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { AppState } from '../../../redux/reducer';
import { RESPONSE_STATUS_SUCCESS } from '../../../utils/httpResponseCode';
import { ILocationParams, ISignUpParams } from '../../../models/auth';
import { ROUTES } from '../../../configs/routes';
import { replace } from 'connected-react-router';

const SignUpPage: FC = () => {
  const [locations, setLocations] = useState<ILocationParams[]>([]);
  const [states, setStates] = useState<ILocationParams[]>([]);
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const getLocation = useCallback(async () => {
    const json = await dispatch(fetchThunk(API_PATHS.getLocation, 'get'));
    if (json.code === RESPONSE_STATUS_SUCCESS) {
      setLocations(json.data);
      return;
    }
  }, [dispatch]);
  const getStateByLocation = useCallback(
    async (pid: number) => {
      const json = await dispatch(fetchThunk(`${API_PATHS.getLocation}?pid=${pid}`, 'get'));
      if (json.code === RESPONSE_STATUS_SUCCESS) {
        setStates(json.data);
        return;
      }
    },
    [dispatch],
  );
  const onSignUp = useCallback(
    async (values: ISignUpParams) => {
      const json = await dispatch(fetchThunk(API_PATHS.signUp, 'post', values));
      if (json.code === RESPONSE_STATUS_SUCCESS) {
        alert('Chúc mừng bạn đăng kí thành công');
        dispatch(replace(ROUTES.login));
        return;
      }
    },
    [dispatch],
  );
  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return (
    <div className={SignUpStyle.container}>
      <img src={logo} alt="" className={SignUpStyle.logo} />
      <SignUpForm onSignUp={onSignUp} locations={locations} getStateByLocation={getStateByLocation} states={states} />
    </div>
  );
};

export default SignUpPage;

import { photoState } from './../modules/photo/redux/photoReducer';
import { connectRouter, RouterState } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';
import authReducer, { AuthState } from '../modules/auth/redux/authReducer';
import intlReducer, { IntlState } from '../modules/intl/redux/intlReducer';
import photoReducer from '../modules/photo/redux/photoReducer';
import payrollReducer, { payrollState } from '../modules/transaction/redux/payrollReducer';

export interface AppState {
  router: RouterState;
  intl: IntlState;
  profile: AuthState;
  photo: photoState;
  payroll: payrollState;
}

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    intl: intlReducer,
    profile: authReducer,
    photo: photoReducer,
    payroll: payrollReducer,
  });
}

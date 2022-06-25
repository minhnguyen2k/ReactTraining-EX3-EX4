import React, { FC, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { API_PATHS } from '../../../configs/api';
import { AppState } from '../../../redux/reducer';
import { fetchThunk } from '../../common/redux/thunk';
import FilterablePayrollTransactionsTable from '../components/FilterablePayrollTransactionsTable ';
import { setPayrollsAction } from '../redux/payrollReducer';

const PayrollTransactionsPage: FC = () => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const getPayrollTransactions = useCallback(async () => {
    const json = await dispatch(fetchThunk(API_PATHS.getPayrollTransactions, 'get'));
    dispatch(setPayrollsAction(json.payrolls));
  }, [dispatch]);
  useEffect(() => {
    getPayrollTransactions();
  }, [getPayrollTransactions]);

  return <FilterablePayrollTransactionsTable />;
};
export default PayrollTransactionsPage;

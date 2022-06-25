import React, { FC, useCallback, useState } from 'react';
import PayrollTransactionsCategoryRow from './PayrollTransactionsCategoryRow';
import PayrollTransactionsRow from './PayrollTransactionsRow';
import transactionStyle from '../scss/Transaction.module.scss';
import IPayroll, { IPayrollDetails } from '../../../models/payroll';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';

import { AppState } from '../../../redux/reducer';
import { useDispatch } from 'react-redux';
import { Action } from 'redux';
import { setPayrollsAction } from '../redux/payrollReducer';
import PayrollStatus from '../../../enum/PayrollStatus';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { ThunkDispatch } from 'redux-thunk';
interface Props {
  localPayrolls: IPayroll[];
  payrolls: IPayroll[];
}

export const getStatusAndDate = (value: IPayroll) => {
  const {
    received,
    fulfilled,
    canceled,
    matched,
    approved,
    date_received,
    date_fulfilled,
    date_canceled,
    date_processed,
    time_created,
  } = value;
  if (fulfilled) return { status: PayrollStatus.FULFILLED, date: date_fulfilled };
  if (canceled) return { status: PayrollStatus.CANCELED, date: date_canceled };
  if (matched || approved) return { status: PayrollStatus.PROCESSING, date: date_processed };
  if (received) return { status: PayrollStatus.RECEIVED, date: date_received };
  return { status: PayrollStatus.PENDING, date: time_created };
};

const PayrollTransactionsTable: FC<Props> = (props: Props) => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const { localPayrolls, payrolls } = props;
  const [open, setOpen] = useState(false);
  const [payrollId, setPayrollId] = useState('');
  const [payroll, setPayroll] = useState<IPayrollDetails>();
  const [isDeleted, setIsDeleted] = useState(false);
  const handleViewDetails = useCallback((values: IPayrollDetails) => {
    setOpen(true);
    setPayroll(values);
  }, []);
  const handleUpdatePayroll = () => {
    let updatedPayroll: IPayroll;
    if (payroll !== undefined) {
      //use locallPayrolls to find quickly (in case localPayrolls are filtered)
      const payrollTarget = localPayrolls.find((localPayroll) => localPayroll.payroll_id === payroll.payrollId);
      const payrolTargetIndex = payrolls.findIndex((localPayroll) => localPayroll.payroll_id === payroll.payrollId);
      if (payrollTarget !== undefined) {
        if (payrollTarget.fulfilled) {
          updatedPayroll = {
            ...payrollTarget,
            date_fulfilled: payroll.date,
            currency: payroll.currency,
            volume_input_in_input_currency: payroll.total,
          };
        } else if (payrollTarget.canceled) {
          updatedPayroll = {
            ...payrollTarget,
            date_canceled: payroll.date,
            currency: payroll.currency,
            volume_input_in_input_currency: payroll.total,
          };
        } else if (payrollTarget.matched || payrollTarget.approved) {
          updatedPayroll = {
            ...payrollTarget,
            date_processed: payroll.date,
            currency: payroll.currency,
            volume_input_in_input_currency: payroll.total,
          };
        } else if (payrollTarget.received) {
          updatedPayroll = {
            ...payrollTarget,
            date_received: payroll.date,
            currency: payroll.currency,
            volume_input_in_input_currency: payroll.total,
          };
        } else {
          updatedPayroll = {
            ...payrollTarget,
            time_created: payroll.date,
            currency: payroll.currency,
            volume_input_in_input_currency: payroll.total,
          };
        }
        payrolls.splice(payrolTargetIndex, 1, updatedPayroll);
        dispatch(setPayrollsAction([...payrolls]));
        setOpen(false);
        setPayroll(undefined);
      }
    }
  };
  const handleClose = () => {
    setOpen(false);
    setPayroll(undefined);
    setIsDeleted(false);
  };
  const handlePrepareDelete = useCallback((id: string) => {
    setOpen(true);
    setIsDeleted(true);
    setPayrollId(id);
  }, []);
  const handleDeletePayroll = () => {
    const deletedPayrolls = payrolls.filter((payroll) => payroll.payroll_id !== payrollId);
    dispatch(setPayrollsAction(deletedPayrolls));
    setOpen(false);
    setIsDeleted(false);
  };
  return (
    <div className={transactionStyle['wrap-table100']}>
      <table>
        <PayrollTransactionsCategoryRow />
        <tbody>
          {localPayrolls.map((payroll) => (
            <PayrollTransactionsRow
              key={payroll.payroll_id}
              payrollId={payroll.payroll_id}
              status={getStatusAndDate(payroll).status}
              date={new Date(getStatusAndDate(payroll).date).toLocaleString('en-ZA', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
              currency={payroll.currency}
              total={payroll.volume_input_in_input_currency}
              invoice={payroll.subpayroll_ids.join('')}
              handleViewDetails={handleViewDetails}
              handlePrepareDelete={handlePrepareDelete}
            />
          ))}
        </tbody>
      </table>
      {payroll && (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Payroll details</DialogTitle>
          <DialogContent>
            <Box mt={1}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  renderInput={(props) => <TextField size="small" {...props} />}
                  label="Date"
                  value={new Date(payroll.date)}
                  onChange={(newValue) => {
                    if (newValue !== null) setPayroll({ ...payroll, date: newValue.toString() });
                  }}
                />
              </LocalizationProvider>
            </Box>
            <Box mt={2}>
              <TextField
                value={payroll.currency}
                label="Currency"
                onChange={(e) => {
                  setPayroll({ ...payroll, currency: e.target.value });
                }}
              />
            </Box>
            <Box mt={2}>
              <TextField
                value={payroll.total}
                label="Currency"
                onChange={(e) => {
                  setPayroll({ ...payroll, total: +e.target.value });
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleUpdatePayroll}>Update</Button>
            <Button onClick={handleClose} autoFocus>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {isDeleted && (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure to delete this?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeletePayroll}>OK</Button>
            <Button onClick={handleClose} autoFocus>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};
export default PayrollTransactionsTable;

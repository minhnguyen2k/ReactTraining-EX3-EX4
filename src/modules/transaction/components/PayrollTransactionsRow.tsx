import { Box, Button } from '@mui/material';
import React, { FC } from 'react';
import IPayroll, { IPayrollDetails } from '../../../models/payroll';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DeleteIcon from '@mui/icons-material/Delete';
import pink from '@mui/material/colors/pink';
import transactionStyle from '../scss/Transaction.module.scss';
import PayrollStatus from '../../../enum/PayrollStatus';
interface Props {
  payrollId: string;
  status: string;
  date: string;
  currency: string;
  total: number;
  invoice: string;
  handleViewDetails(values: IPayrollDetails): void;
  handlePrepareDelete(id: string): void;
}

const PayrollTransactionsRow: FC<Props> = (props: Props) => {
  const { payrollId, status, date, currency, total, invoice, handleViewDetails, handlePrepareDelete } = props;
  const getColorStatus = () => {
    switch (status) {
      case PayrollStatus.FULFILLED:
        return '#66cc00';
      case PayrollStatus.RECEIVED:
        return '#00e6e6';
      case PayrollStatus.PROCESSING:
        return '#ffbf00';
      case PayrollStatus.CANCELED:
        return 'red';
      default:
        return '#9e9c94';
    }
  };
  return (
    <tr>
      <td style={{ color: getColorStatus() }}>{status}</td>
      <td>{date}</td>
      <td>{currency}</td>
      <td>{total}</td>
      <td>{invoice}</td>
      <td>
        <Button
          onClick={() =>
            handleViewDetails({
              status,
              payrollId,
              date,
              currency,
              total,
              invoice,
            })
          }
          color="info"
          style={{ borderRadius: '20px' }}
          variant="outlined"
          endIcon={<KeyboardArrowDownIcon />}
        >
          View Details
        </Button>
      </td>
      <td>
        <DeleteIcon
          onClick={() => {
            handlePrepareDelete(payrollId);
          }}
          sx={{ color: pink[500] }}
        />
      </td>
    </tr>
  );
};
export default React.memo(PayrollTransactionsRow);

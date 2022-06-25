import React, { FC } from 'react';
import transactionStyle from '../scss/Transaction.module.scss';

const PayrollTransactionsCategoryRow: FC = () => {
  return (
    <thead>
      <tr className={transactionStyle['table100-head']}>
        <th>Status</th>
        <th>Date</th>
        <th>Currency</th>
        <th>Total</th>
        <th>Invoice#</th>
      </tr>
    </thead>
  );
};
export default PayrollTransactionsCategoryRow;

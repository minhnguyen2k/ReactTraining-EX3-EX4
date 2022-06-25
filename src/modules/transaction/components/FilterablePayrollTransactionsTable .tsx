import React, { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../../redux/reducer';
import FilterBar, { IFilterFormData } from './FilterBar';
import PayrollTransactionsTable, { getStatusAndDate } from './PayrollTransactionsTable';
import transactionStyle from '../scss/Transaction.module.scss';
import IPayroll, { IPayrollDetails } from '../../../models/payroll';
import { format, isBefore } from 'date-fns';

const FilterablePayrollTransactionsTable: FC = () => {
  const payrolls = useSelector((state: AppState) => state.payroll.payrolls);
  const [localPayrolls, setLocalPayrolls] = useState<IPayroll[]>([]);
  const filterPayrolls = (values: IFilterFormData) => {
    let filteredPayrolls = [...payrolls];
    if (values.status !== '') {
      filteredPayrolls = filteredPayrolls.filter((payroll) => {
        return getStatusAndDate(payroll).status === values.status;
      });
    }
    if (values.from !== null) {
      filteredPayrolls = filteredPayrolls.filter(
        (payroll) =>
          new Date(format(new Date(getStatusAndDate(payroll).date), 'MM/dd/yyyy')) >=
          new Date(format(values.from!, 'MM/dd/yyyy')),
      );
    }
    if (values.to !== null) {
      filteredPayrolls = filteredPayrolls.filter((payroll) =>
        isBefore(
          new Date(format(new Date(getStatusAndDate(payroll).date), 'MM/dd/yyyy')),
          new Date(format(values.to!, 'MM/dd/yyyy')),
        ),
      );
    }
    if (values.invoice !== '') {
      filteredPayrolls = filteredPayrolls.filter((payroll) => payroll.subpayroll_ids.join('') === values.invoice);
    }
    setLocalPayrolls(filteredPayrolls);
  };
  const clearFilterPayrolls = () => {
    setLocalPayrolls([...payrolls]);
  };
  useEffect(() => {
    setLocalPayrolls([...payrolls]);
  }, [payrolls]);

  return (
    <div className={transactionStyle.limiter}>
      <h3>Payroll Transactions List</h3>
      <FilterBar filterPayrolls={filterPayrolls} clearFilterPayrolls={clearFilterPayrolls} />
      <PayrollTransactionsTable payrolls={payrolls} localPayrolls={localPayrolls} />
    </div>
  );
};
export default FilterablePayrollTransactionsTable;

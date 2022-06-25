import IPayroll from '../../../models/payroll';
import { ActionType, createCustomAction, getType } from 'typesafe-actions';
export interface payrollState {
  payrolls: IPayroll[];
}
export const setPayrollsAction = createCustomAction('payroll/setPayroll', (payload: IPayroll[]) => {
  return {
    payload,
  };
});

const actions = { setPayrollsAction };

type Action = ActionType<typeof actions>;

export default function reducer(
  state: payrollState = {
    payrolls: [],
  },
  action: Action,
) {
  switch (action.type) {
    case getType(setPayrollsAction):
      return { ...state, payrolls: action.payload };
    default:
      return state;
  }
}

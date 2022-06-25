import { Box, Button, MenuItem, TextField } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { FC, useMemo, useState } from 'react';
import * as yup from 'yup';

import TextFieldFormik from '../../common/components/TextFieldFormik';
import { DatePicker, DateTimePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

interface Props {
  clearFilterPayrolls(): void;
  filterPayrolls(values: IFilterFormData): void;
}
export interface IFilterFormData {
  status: string;
  from: Date | null;
  to: Date | null;
  invoice: string;
}
const FilterBar: FC<Props> = (props: Props) => {
  const { filterPayrolls, clearFilterPayrolls } = props;
  console.log('rerender');
  const [initialValues, setInitialValues] = useState<IFilterFormData>({
    status: '',
    from: null,
    to: null,
    invoice: '',
  });
  const validationSchema = useMemo(() => yup.object({}), []);
  const onSubmit = (data: IFilterFormData) => {
    filterPayrolls(data);
  };
  return (
    <Formik initialValues={initialValues} enableReinitialize validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ setFieldValue, values, setValues }) => {
        return (
          <Form>
            <Box display="flex" mt={3} justifyContent="space-between" width="1170px">
              <TextFieldFormik
                required={false}
                style={{ width: '150px' }}
                select
                name="status"
                size="small"
                label="Status"
              >
                <MenuItem value="Processing">Processing</MenuItem>
                <MenuItem value="Fulfilled">Fulfilled</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Received">Received</MenuItem>
                <MenuItem value="Canceled">Canceled</MenuItem>
              </TextFieldFormik>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  renderInput={(props) => <TextField size="small" {...props} />}
                  label="From"
                  value={values.from}
                  onChange={(newValue) => {
                    setFieldValue('from', newValue);
                  }}
                />
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  renderInput={(props) => <TextField size="small" {...props} />}
                  label="To"
                  value={values.to}
                  onChange={(newValue) => {
                    setFieldValue('to', newValue);
                  }}
                />
              </LocalizationProvider>

              <TextFieldFormik
                required={false}
                style={{ width: '150px' }}
                name="invoice"
                size="small"
                label="Invoice"
              />

              <Box>
                <Button type="submit" size="large" variant="outlined">
                  Apply
                </Button>
                <Button
                  color="error"
                  size="large"
                  variant="outlined"
                  style={{ marginLeft: '10px' }}
                  onClick={() => {
                    setValues(initialValues);
                    clearFilterPayrolls();
                  }}
                >
                  Clear
                </Button>
              </Box>
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
};
export default FilterBar;

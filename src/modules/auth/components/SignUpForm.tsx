import { Box, Button, MenuItem } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { FC, useMemo, useState } from 'react';
import * as yup from 'yup';
import { IGenderParams, ILocationParams, ISignUpParams } from '../../../models/auth';
import TextFieldFormik from '../../common/components/TextFieldFormik';

interface Props {
  onSignUp(values: ISignUpParams): void;
  locations: Array<ILocationParams>;
  getStateByLocation(pid: number): void;
  states: Array<ILocationParams>;
}
const SignUpForm: FC<Props> = (props: Props) => {
  const { onSignUp, locations, getStateByLocation, states } = props;
  const [initialValues, setInitialValues] = useState<ISignUpParams>({
    email: '',
    password: '',
    repeatPassword: '',
    name: '',
    gender: '0',
    region: '0',
    state: '0',
  });
  const Genders = useMemo(
    (): IGenderParams[] => [
      { label: 'Male', value: 'Male' },
      { label: 'Female', value: 'Female' },
    ],
    [],
  );

  const validationSchema = useMemo(
    () =>
      yup.object({
        email: yup.string().required().email(),
        name: yup.string().required(),
        password: yup.string().required().min(4),
        gender: yup.string().test('required', 'Region must be required', (val) => val !== '0'),
        repeatPassword: yup
          .string()
          .required()
          .oneOf([yup.ref('password'), null], 'Password does not match'),
        region: yup.string().test('required', 'Region must be required', (val) => val !== '0'),
        state: yup.string().test('required', 'State must be required', (val) => val !== '0'),
      }),
    [],
  );
  const onSubmit = (data: ISignUpParams) => {
    onSignUp(data);
  };

  const renderOptions = (datas: IGenderParams[] | ILocationParams[]) => {
    const options = [
      <MenuItem disabled selected key="" value="0">
        --Select an option--
      </MenuItem>,
    ];

    datas.map((data) => {
      if (data as ILocationParams) {
        const dataILocationParams = data as ILocationParams;
        options.push(
          <MenuItem key={dataILocationParams.id} value={dataILocationParams.id}>
            {dataILocationParams.name}
          </MenuItem>,
        );
      }
      const dataIGenderParams = data as IGenderParams;
      options.push(
        <MenuItem key={dataIGenderParams.value} value={dataIGenderParams.value}>
          {dataIGenderParams.label}
        </MenuItem>,
      );
    });
    return options;
  };

  return (
    <Formik initialValues={initialValues} enableReinitialize validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ setFieldValue, values }) => {
        return (
          <Form>
            <Box mb={2}>
              <TextFieldFormik name="email" label="Email" />
            </Box>
            <Box mb={2}>
              <TextFieldFormik name="password" label="Password" />
            </Box>
            <Box mb={2}>
              <TextFieldFormik name="repeatPassword" label="Confirm Password" />
            </Box>
            <Box mb={2}>
              <TextFieldFormik name="name" label="Full Name" />
            </Box>
            <Box mb={2}>
              <TextFieldFormik select name="gender" label="Gender">
                {renderOptions(Genders)}
              </TextFieldFormik>
            </Box>
            <Box mb={2}>
              <TextFieldFormik
                onChange={(e) => {
                  setFieldValue('region', e.target.value);
                  setFieldValue('state', '0');
                  getStateByLocation(+e.target.value);
                }}
                select
                name="region"
                label="Region"
              >
                {renderOptions(locations)}
              </TextFieldFormik>
            </Box>
            {values.region !== '0' && (
              <Box mb={2}>
                <TextFieldFormik select name="state" label="State">
                  {renderOptions(states)}
                </TextFieldFormik>
              </Box>
            )}
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default SignUpForm;

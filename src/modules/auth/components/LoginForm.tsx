import React, { FC, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { ILoginParams, ILoginValidation } from '../../../models/auth';
import loginStyle from '../scss/Login.module.scss';
import { validateLogin, validLogin } from '../utils';

interface Props {
  onLogin(values: ILoginParams): void;
  errorMessage: string;
}

const LoginForm: FC<Props> = (props: Props) => {
  const { onLogin, errorMessage } = props;
  const [formValues, setFormValues] = useState<ILoginParams>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [validate, setValidate] = useState<ILoginValidation>();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validate = validateLogin(formValues);
    setValidate(validate);
    if (!validLogin(validate)) return;
    onLogin(formValues);
  };
  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      {!!errorMessage && (
        <div className="alert alert-danger" role="alert" style={{ width: '100%' }}>
          {errorMessage}
        </div>
      )}
      <div style={{ marginBottom: '20px' }}>
        <span className={loginStyle['field-name']}>Email: </span>
        <input
          style={{ minWidth: '60%' }}
          value={formValues.email}
          onChange={(e) => {
            setFormValues({ ...formValues, email: e.target.value });
          }}
        />
        {validate?.email && (
          <small className={`text-danger ${loginStyle.error}`}>
            <FormattedMessage id={validate?.email} />
          </small>
        )}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <span className={loginStyle['field-name']}>Password: </span>
        <input
          style={{ minWidth: '60%' }}
          type="password"
          value={formValues.password}
          onChange={(e) => {
            setFormValues({ ...formValues, password: e.target.value });
          }}
        />
        {validate?.password && (
          <small className={`text-danger ${loginStyle.error}`}>
            <FormattedMessage id={validate?.password} />
          </small>
        )}
      </div>
      <div>
        <span className={loginStyle['field-name']}>Remember Me: </span>
        <input
          style={{ margin: '0px' }}
          type="checkbox"
          checked={formValues.rememberMe}
          onChange={(e) => {
            setFormValues({ ...formValues, rememberMe: e.target.checked });
          }}
        />
      </div>

      <button className={loginStyle.btn} type="submit">
        Login
      </button>
    </form>
  );
};
export default LoginForm;

export interface ILoginParams {
  email: string;
  password: string;
  rememberMe: boolean;
}
export interface ISignUpParams {
  email: string;
  password: string;
  repeatPassword: string;
  name: string;
  gender: string;
  region: string;
  state: string;
}

export interface ILoginValidation {
  email: string;
  password: string;
}

export interface IGenderParams {
  label: string;
  value: string | number;
}

export interface ILocationParams {
  id: string | number;
  name: string;
  pid: number | null;
}

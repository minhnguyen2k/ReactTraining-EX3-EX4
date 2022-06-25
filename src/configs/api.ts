import { APIHost } from '../utils/constants';

enum APIService {
  auth,
  protected,
  public,
}

function getBaseUrl(service: APIService) {
  if (service === APIService.auth) {
    return `${APIHost}/auth`;
  } else if (service === APIService.protected) {
    return `${APIHost}/protected`;
  } else if (service === APIService.public) {
    return `${APIHost}`;
  }

  return '';
}

export const API_PATHS = {
  signIn: `${getBaseUrl(APIService.auth)}/login`,
  signUp: `${getBaseUrl(APIService.auth)}/register`,
  userProfile: `${getBaseUrl(APIService.public)}/user`,
  getLocation: `${getBaseUrl(APIService.public)}/location`,
  getPhotos: 'https://jsonplaceholder.typicode.com/photos?_start=0&_end=10',
  getPayrollTransactions: './fake-data.json',
};

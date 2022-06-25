import { ActionType, createCustomAction, getType } from 'typesafe-actions';
import { IPhoto } from './../../../models/photo';
export interface photoState {
  photos?: IPhoto[];
}
export const setPhotosAction = createCustomAction('photo/setPhotos', (payload: IPhoto[]) => {
  return {
    payload,
  };
});

const actions = { setPhotosAction };

type Action = ActionType<typeof actions>;

export default function reducer(state: photoState = {}, action: Action) {
  switch (action.type) {
    case getType(setPhotosAction):
      return { ...state, photos: action.payload };
    default:
      return state;
  }
}

import { Box, Button } from '@mui/material';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { API_PATHS } from '../../../configs/api';
import { IPhoto } from '../../../models/photo';
import { AppState } from '../../../redux/reducer';
import photoStyle from '../scss/Photo.module.scss';
import { setPhotosAction } from '../redux/photoReducer';
import { fetchThunk } from '../../common/redux/thunk';
import PhotoItem from '../components/PhotoItem';

const PhotoPage: FC = () => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const [photos, setPhotos] = useState<IPhoto[]>([]);
  const [isButtonDisabled, setButtonDisabled] = useState(true);
  const photosFromRedux = useSelector((state: AppState) => state.photo.photos);
  const getPhotos = useCallback(async () => {
    const json = await dispatch(fetchThunk(API_PATHS.getPhotos, 'get'));
    dispatch(setPhotosAction([...json]));
    setPhotos([...json]);
  }, [dispatch]);

  const handleChange = useCallback((photoIndex, title) => {
    setPhotos((prevState) => {
      const photo = prevState.find((photo, index) => index === photoIndex);
      let newPhoto;
      if (prevState[photoIndex].title !== title) {
        setButtonDisabled(false);
      }
      if (photo !== undefined) {
        newPhoto = { ...photo, title: title };
        prevState.splice(photoIndex, 1, newPhoto);
      }
      return [...prevState];
    });
  }, []);

  const handleSubmit = () => {
    dispatch(setPhotosAction([...photos]));
  };
  const handleReset = () => {
    setButtonDisabled(true);
    setPhotos([...photosFromRedux!]);
  };
  useEffect(() => {
    getPhotos();
  }, [getPhotos]);

  return (
    <Box className={photoStyle.container}>
      <Box textAlign="center" mb={4}>
        <Button disabled={isButtonDisabled} onClick={handleSubmit} variant="outlined">
          Confirm
        </Button>
        <Button disabled={isButtonDisabled} onClick={handleReset} style={{ marginLeft: '10px' }} variant="outlined">
          Reset
        </Button>
      </Box>
      {photos.map((photo, index) => {
        return (
          <PhotoItem
            handleChange={handleChange}
            photoIndex={index}
            photoId={photo.id}
            photoUrl={photo.url}
            photoTitle={photo.title}
            key={photo.id + photo.title}
          />
        );
      })}
    </Box>
  );
};
export default PhotoPage;

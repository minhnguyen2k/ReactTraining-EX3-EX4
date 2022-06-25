import { Box } from '@mui/material';
import React, { FC, useEffect, useRef, useState } from 'react';
import photoStyle from '../scss/Photo.module.scss';
interface Props {
  photoIndex: number;
  photoId: number;
  photoUrl: string;
  photoTitle: string;
  handleChange(photoIndex: number, title: string): void;
}
const PhotoItem: FC<Props> = (props: Props) => {
  const { photoIndex, photoId, photoUrl, photoTitle, handleChange } = props;
  const [title, setTitle] = useState(photoTitle);
  const [isClicked, setIsClicked] = useState(false);
  const inputEl = useRef<HTMLInputElement>(null);
  const handleOnMouseOver = (e: React.MouseEvent<HTMLLabelElement, MouseEvent>) => {
    e.currentTarget.style.border = '2px dashed black ';
  };
  const handleOnMouseLeave = (e: React.MouseEvent<HTMLLabelElement, MouseEvent>) => {
    e.currentTarget.style.border = 'none';
  };
  const handleClick = () => {
    setIsClicked(true);
  };
  useEffect(() => {
    if (inputEl.current !== null) {
      inputEl.current.focus();
    }
  }, [isClicked]);
  const handleOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.border = 'none';
    handleChange(photoIndex, title);
  };

  return (
    <Box mb={2} className={photoId % 2 === 0 ? photoStyle['photo-item'] : ''}>
      <Box display="flex">
        <img width="150px" src={photoUrl} alt="" />
        <Box width="100%" ml={4}>
          {isClicked ? (
            <input
              className={photoStyle['input-title']}
              ref={inputEl}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              onBlur={(e) => {
                handleOnBlur(e);
              }}
            />
          ) : (
            <label
              onClick={handleClick}
              style={{ width: '80%' }}
              onMouseOver={(e) => {
                handleOnMouseOver(e);
              }}
              onMouseLeave={(e) => {
                handleOnMouseLeave(e);
              }}
            >
              {title}
            </label>
          )}
          <p>{Date.now()}</p>
        </Box>
      </Box>
    </Box>
  );
};
export default React.memo(PhotoItem);

import React, { useState } from 'react';
import { IconButton, Button } from '@mui/material';
import ProfileImg from '../../Assets/Img/Img.png';
import styles from './MainRoomsDetail.module.css';
import PushPinIcon from '@mui/icons-material/PushPin';
function MainRoomsDetail(props) {
  const [pincolor, setPincolor] = useState('#FFFFFF');
  const changeColor = () => {
    if (pincolor === '#FFFFFF') setPincolor('#FFCD29');
    else setPincolor('#FFFFFF');
  };
  return (
    <div>
      <Button
        sx={{
          minHeight: 48,
          justifyContent: 'center',
          alignItems: 'center',
          mx: '10px',
          my: '10px',
          px: 2.5,
          borderRadius: '10px',
          background: '#97B2E1',
          height: '200px',
          width: '200px',
          position: 'relative',
          '&:hover': {
            background: '#97B2E1' + '90',
          },
        }}>
        <PushPinIcon
          sx={{
            position: 'absolute',
            top: 5,
            left: 5,
            color: pincolor,
            margin: 0,
            padding: 0,
            height: '35px',
            width: '35px',
          }}
          onClick={changeColor}></PushPinIcon>

        {props.detail}
        <img src={ProfileImg} className={styles.profileimg_mini} alt="" />
        <img src={ProfileImg} className={styles.profileimg_mini} alt="" />
      </Button>
    </div>
  );
}

export default MainRoomsDetail;

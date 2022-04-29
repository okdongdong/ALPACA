import React, { useState } from 'react';
import { styled, IconButton, Button, Grid, Stack } from '@mui/material';
import ProfileImg from '../../Assets/Img/Img.png';
import styles from './MainRoomsDetail.module.css';
import PushPinIcon from '@mui/icons-material/PushPin';

const NameLabel = styled('label')(({ theme }) => ({
  color: theme.palette.txt,
  textAlign: 'center',
}));
const CButton = styled(Button)(({ theme }) => ({
  minHeight: 48,
  display: 'Grid',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '10px',
  borderRadius: '10px',
  background: theme.palette.main,
  height: '200px',
  width: '200px',
  position: 'relative',
  '&:hover': {
    background: theme.palette.main + '90',
  },
}));
const Clabel = styled('label')(({ theme }) => ({
  color: theme.palette.txt,
  textAlign: 'center',
}));

function MainRoomsDetail(props: any) {
  //핀고정
  const [pincolor, setPincolor] = useState('#FFFFFF');
  const changeColor = () => {
    if (pincolor === '#FFFFFF') setPincolor('#FFCD29');
    else setPincolor('#FFFFFF');
  };

  return (
    <div>
      <CButton>
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
        <Grid container sx={{ padding: 2 }}>
          {props.detail[2].map((i: any) => {
            return (
              <Grid item xs={6} key={i} sx={{ padding: 1 }}>
                <img src={ProfileImg} className={styles.profileimg_mini} alt="" />
                {/* <Clabel>{member.nickname}</Clabel> */}
              </Grid>
            );
          })}
        </Grid>
        <NameLabel>{props.detail[0]}</NameLabel>
      </CButton>
    </div>
  );
}

export default MainRoomsDetail;

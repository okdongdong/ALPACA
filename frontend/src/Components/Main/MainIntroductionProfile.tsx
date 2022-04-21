import React from 'react';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import ProfileImg from '../../Assets/Img/Img.png';
import styles from './MainIntroductionProfile.module.css';

function MainIntroductionProfile() {
  const ProfileDiv = styled('div')({
    position: 'relative',
    marginRight: '30px',
  });
  return (
    <ProfileDiv>
      <img src={ProfileImg} className={styles.profileimg} alt="" />
      <IconButton
        aria-label="EditIcon"
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          minHeight: 48,
          justifyContent: 'center',
          alignItems: 'center',
          mx: 'auto',
          my: '10px',
          px: 2.5,
          borderRadius: '100px',
          background: '#97B2E1',
          height: '50px',
          width: '50px',
          '&:hover': {
            background: '#97B2E1' + '90',
          },
        }}>
        <EditIcon
          sx={{
            minWidth: 0,
            justifyContent: 'center',
            color: '#FFFFFF',
          }}
        />
      </IconButton>
    </ProfileDiv>
  );
}

export default MainIntroductionProfile;

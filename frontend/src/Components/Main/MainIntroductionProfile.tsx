import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import ProfileImg from '../../Assets/Img/Img.png';
import styles from './MainIntroductionProfile.module.css';
import EditProfile from '../Dialogs/EditProfile';

export interface ProfileProps {
  callback: Function;
}

const ProfileDiv = styled('div')({
  position: 'relative',
  marginRight: '30px',
});

function MainIntroductionProfile(props: ProfileProps) {
  const [open, setOpen] = React.useState(false);
  const [userData, setUserData] = useState<any[] | null>();
  const EditUserData = (sendData: any) => {
    setUserData(sendData);
    props.callback(userData);
  };
  // const EditUserData = (sendData: any) => {
  //   props.callback(sendData);
  // };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

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
        }}
        onClick={handleClickOpen}>
        <EditIcon
          sx={{
            minWidth: 0,
            justifyContent: 'center',
            color: '#FFFFFF',
          }}
        />
      </IconButton>
      <EditProfile open={open} onClose={handleClose} callback={EditUserData} />
      {/* <img src={userData[3]} alt="" /> */}
    </ProfileDiv>
  );
}

export default MainIntroductionProfile;

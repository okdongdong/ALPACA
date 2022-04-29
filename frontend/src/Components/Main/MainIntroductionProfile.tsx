import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import styles from './MainIntroductionProfile.module.css';
import EditProfile from '../Dialogs/EditProfile';
import { useDispatch } from 'react-redux';
import { setTheme } from '../../Redux/themeReducer';
import { customAxios } from '../../Lib/customAxios';
import { useSelector } from 'react-redux';
import { setUserInfo } from '../../Redux/accountReducer';
import { useNavigate } from 'react-router-dom';

export interface ProfileProps {
  callback: Function;
}

const ProfileDiv = styled('div')({
  position: 'relative',
  marginRight: '30px',
});

const CIconButton = styled(IconButton)(({ theme }) => ({
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
  background: theme.palette.main,
  height: '50px',
  width: '50px',
  '&:hover': {
    background: theme.palette.main + '90',
  },
}));

function MainIntroductionProfile(props: ProfileProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state: any) => state.account);
  const [open, setOpen] = React.useState(false);
  const [userData, setUserData] = useState<any[] | null>();
  const EditUserData = (sendData: any) => {
    setUserData(sendData);
    props.callback(userData);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ProfileDiv>
      <img src={userInfo.profileImg} className={styles.profileimg} alt="" />
      <CIconButton aria-label="EditIcon" onClick={handleClickOpen}>
        <EditIcon
          sx={{
            minWidth: 0,
            justifyContent: 'center',
            color: '#FFFFFF',
          }}
        />
      </CIconButton>
      <EditProfile open={open} onClose={handleClose} callback={EditUserData} />
      {/* <img src={userData[3]} alt="" /> */}
    </ProfileDiv>
  );
}

export default MainIntroductionProfile;

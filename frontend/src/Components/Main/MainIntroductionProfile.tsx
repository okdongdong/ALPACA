import { useState } from 'react';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import styles from './MainIntroductionProfile.module.css';
import EditProfile from '../Dialogs/EditProfile';
import { useSelector } from 'react-redux';
import { BrowserView, MobileView } from 'react-device-detect';
import { Avatar } from '@mui/material';

const ProfileDiv = styled('div')({
  position: 'relative',
  marginRight: '30px',
});

const CIconButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  right: -16,
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

function MainIntroductionProfile() {
  const userInfo = useSelector((state: any) => state.account);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <BrowserView>
        <ProfileDiv>
          <Avatar
            src={userInfo.profileImg}
            className={styles.profileimg}
            alt=""
            sx={{ backgroundColor: 'rgba(123,123,123,0.5)', width: 100, height: 100 }}
          />
          <CIconButton aria-label="EditIcon" onClick={handleClickOpen}>
            <EditIcon
              sx={{
                minWidth: 0,
                justifyContent: 'center',
                color: '#FFFFFF',
              }}
            />
          </CIconButton>
          <EditProfile open={open} onClose={handleClose} />
        </ProfileDiv>
      </BrowserView>
      <MobileView>
        <ProfileDiv>
          <Avatar
            src={userInfo.profileImg}
            className={styles.profileimg}
            alt=""
            style={{
              height: '30vw',
              width: '30vw',
              maxHeight: '200px',
              maxWidth: '200px',
              marginLeft: '16px',
              backgroundColor: 'rgba(123,123,123,0.5)',
            }}
          />
          <CIconButton
            aria-label="EditIcon"
            onClick={handleClickOpen}
            sx={{ height: '5vh', width: '5vh', minHeight: 0 }}>
            <EditIcon
              sx={{
                minWidth: 0,
                justifyContent: 'center',
                color: '#FFFFFF',
              }}
            />
          </CIconButton>
          <EditProfile open={open} onClose={handleClose} />
        </ProfileDiv>
      </MobileView>
    </>
  );
}

export default MainIntroductionProfile;

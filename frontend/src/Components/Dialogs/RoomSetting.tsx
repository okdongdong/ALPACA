import { Dialog, DialogTitle, Stack, styled, useTheme } from '@mui/material';
import React from 'react';
import { isMobile } from 'react-device-detect';
import { useDispatch, useSelector } from 'react-redux';

import { settingOn } from '../../Redux/roomReducer';
import RoomMainIntroductionMemberSetting from '../Room/Main/RoomMainIntroductionMemberSetting';
import RoomMainIntroductionSetting from '../Room/Main/RoomMainIntroductionSetting';
import RoomMainSetting from '../Room/Main/RoomMainSetting';

interface RoomSettingProps {
  setInviteOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CustomBox = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.bg,
  color: theme.palette.txt,
  minWidth: isMobile ? 300 : 600,
  padding: theme.spacing(isMobile ? 2 : 3),
}));

function RoomSetting({ setInviteOpen }: RoomSettingProps) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isSetting = useSelector((state: any) => state.room.isSetting);

  const onCloseHandler = () => {
    setInviteOpen(false);
    dispatch(settingOn());
  };

  return (
    <Dialog
      open={isSetting}
      onClose={onCloseHandler}
      maxWidth="lg"
      sx={{ '& .MuiDialog-paper': { margin: isMobile ? 0 : '' } }}>
      <DialogTitle
        sx={{
          padding: 2,
          fontSize: isMobile ? 12 : '',
          backgroundColor: theme.palette.accent,
          color: theme.palette.icon,
        }}>
        <RoomMainSetting data={onCloseHandler} />
      </DialogTitle>
      <CustomBox spacing={2}>
        <RoomMainIntroductionSetting />
        <RoomMainIntroductionMemberSetting setInviteOpen={setInviteOpen} />
      </CustomBox>
    </Dialog>
  );
}

export default RoomSetting;

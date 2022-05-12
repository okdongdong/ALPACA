import { Dialog, DialogTitle, Divider, Stack, styled, useTheme } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { settingOn } from '../../Redux/roomReducer';
import RoomMainIntroductionMemberSetting from '../Room/Main/RoomMainIntroductionMemberSetting';
import RoomMainIntroductionSetting from '../Room/Main/RoomMainIntroductionSetting';
import RoomMainSetting from '../Room/Main/RoomMainSetting';

interface RoomSettingProps {
  setInviteOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CustomBox = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.component,
  color: theme.palette.txt,
  minWidth: 600,
  padding: theme.spacing(3),
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
    <Dialog open={isSetting} onClose={onCloseHandler} maxWidth="lg">
      <DialogTitle sx={{ backgroundColor: theme.palette.accent, color: theme.palette.icon }}>
        <RoomMainSetting />
      </DialogTitle>
      <CustomBox spacing={2}>
        <RoomMainIntroductionSetting />
        <RoomMainIntroductionMemberSetting setInviteOpen={setInviteOpen} />
      </CustomBox>
    </Dialog>
  );
}

export default RoomSetting;

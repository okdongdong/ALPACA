import { useState, useEffect } from 'react';
import { Dialog, Grid, IconButton, DialogTitle } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { customAxios } from '../../Lib/customAxios';
import { useSelector } from 'react-redux';
import CInput from '../Commons/CInput';
import CBtn from '../Commons/CBtn';
import ClearIcon from '@mui/icons-material/Clear';
import useAlert from '../../Hooks/useAlert';

const CustomContent = styled('div')(({ theme }) => ({
  minWidth: 350,
  minHeight: 300,
  display: 'Grid',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.palette.bg,
}));

const CDialogTitle = styled(DialogTitle)(({ theme }) => ({
  color: theme.palette.txt,
}));

export interface EditPasswordProps {
  open: boolean;
  onClose: () => void;
}

function EditPassword(props: EditPasswordProps) {
  const theme = useTheme();
  const cAlert = useAlert();
  const userInfo = useSelector((state: any) => state.account);
  const [presentPassword, setPresentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [newPasswordCheck, setNewPasswordCheck] = useState<string>('');
  const [passwordMessage, setPasswordMessage] = useState<string>('');
  const [passwordCheckMessage, setPasswordCheckMessage] = useState<string>('');
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,30}$/;
  const { onClose, open } = props;

  const cancleClose = () => {
    onClose();
  };

  const editPasswordData = async () => {
    try {
      await customAxios({
        method: 'put',
        url: `/user/changePassword/${userInfo.userId}`,
        data: {
          changedPassword: newPassword,
          changedPasswordCheck: newPasswordCheck,
          password: presentPassword,
        },
      });
      alert('비밀번호를 변경하였습니다.');
    } catch (e: any) {
      cAlert.fire({
        title: '비밀번호 변경 실패!',
        text: e.response.data.message || '현재 비밀번호와 일치하지 않습니다.',
        icon: 'error',
        showConfirmButton: true,
      });
    }
  };

  const editPasswordClose = () => {
    editPasswordData();
    onClose();
  };

  useEffect(() => {
    if (!newPassword || passwordRegex.test(newPassword)) {
      setPasswordMessage('');
    } else {
      setPasswordMessage('영문자+숫자+특수문자 조합으로 8자리이상 입력하세요.');
    }
  }, [newPassword]);

  useEffect(() => {
    if (!!newPasswordCheck && newPassword !== newPasswordCheck) {
      setPasswordCheckMessage('비밀번호가 일치하지 않습니다.');
    } else {
      setPasswordCheckMessage('');
    }
  }, [newPassword, newPasswordCheck]);

  return (
    <Dialog onClose={editPasswordClose} open={open} maxWidth="xs">
      <CustomContent>
        <CDialogTitle sx={{ textAlign: 'center' }}>비밀번호 변경</CDialogTitle>
        <Grid
          container
          sx={{
            padding: 1,
          }}>
          <Grid item xs={11}>
            <CInput onChange={setPresentPassword} label="현재 비밀번호" type="password"></CInput>
          </Grid>
          <Grid item xs={11}>
            <CInput
              onChange={setNewPassword}
              label="새 비밀번호"
              type="password"
              helperText={passwordMessage}></CInput>
          </Grid>
          <Grid item xs={11}>
            <CInput
              onChange={setNewPasswordCheck}
              label="새 비밀번호 확인"
              type="password"
              helperText={passwordCheckMessage}></CInput>
          </Grid>
        </Grid>
        <Grid
          sx={{
            padding: 1,
            display: 'flex',
            justifyContent: 'right',
            alignItem: 'center',
          }}>
          {' '}
          <CBtn
            width="30%"
            content="변경하기"
            onClick={editPasswordClose}
            disabled={!!passwordMessage || !!passwordCheckMessage}
          />
        </Grid>
        <IconButton
          component="span"
          sx={{ position: 'absolute', top: 10, right: 10 }}
          onClick={cancleClose}>
          <ClearIcon
            sx={{
              minWidth: 0,
              justifyContent: 'center',
              color: theme.palette.txt,
            }}
          />
        </IconButton>
      </CustomContent>
    </Dialog>
  );
}

export default EditPassword;

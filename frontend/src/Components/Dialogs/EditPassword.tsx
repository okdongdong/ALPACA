import { useState, useEffect } from 'react';
import { Dialog, Grid, DialogTitle } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { customAxios } from '../../Lib/customAxios';
import { useSelector } from 'react-redux';
import CInput from '../Commons/CInput';
import CBtn from '../Commons/CBtn';
import useAlert from '../../Hooks/useAlert';
import { Close } from '@mui/icons-material';
import { isMobile } from 'react-device-detect';

const CustomContent = styled('div')(({ theme }) => ({
  minWidth: 350,
  minHeight: 300,
  paddingTop: theme.spacing(5),
  display: 'Grid',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.palette.bg,
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

      onClose();

      cAlert.fire({
        title: '비밀번호 변경 완료!',
        text: '비밀번호를 변경 하였습니다.',
        icon: 'success',
        showConfirmButton: true,
      });
    } catch (e: any) {
      cAlert.fire({
        title: '비밀번호 변경 실패!',
        text: e.response.data.message || '현재 비밀번호와 일치하지 않습니다.',
        icon: 'error',
        showConfirmButton: true,
      });
    }
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
    <Dialog onClose={onClose} open={open} maxWidth="xs">
      <DialogTitle
        sx={{
          padding: 2,
          fontSize: isMobile ? 12 : '',
          backgroundColor: theme.palette.accent,
          color: theme.palette.icon,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <div style={{ fontSize: 24, fontWeight: 'bold' }}>비밀번호 변경</div>
        <Close onClick={onClose} />
      </DialogTitle>

      <CustomContent>
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
            onClick={editPasswordData}
            disabled={!!passwordMessage || !!passwordCheckMessage}
          />
        </Grid>
      </CustomContent>
    </Dialog>
  );
}

export default EditPassword;

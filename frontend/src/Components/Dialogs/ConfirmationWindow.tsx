import { Dialog, Stack, styled } from '@mui/material';
import React from 'react';
import CBtn from '../Commons/CBtn';

interface ConfirmationWindowProps {
  children?: string | React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  confirm: () => void;
  cancel?: () => void;
}
const CustomBox = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.bg,
  color: theme.palette.txt,
  justifyContent: 'center',
  alignItems: 'center',
  width: 400,
  height: 200,
  textAlign: 'center',
}));

function ConfirmationWindow({
  children,
  open,
  setOpen,
  confirm,
  cancel = () => {},
}: ConfirmationWindowProps) {
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <CustomBox spacing={5}>
        <div>{children}</div>
        <Stack spacing={5} direction="row">
          <CBtn
            height="100%"
            onClick={() => {
              setOpen(false);
              cancel();
            }}>
            취소
          </CBtn>
          <CBtn
            height="100%"
            onClick={() => {
              setOpen(false);
              confirm();
            }}>
            확인
          </CBtn>
        </Stack>
      </CustomBox>
    </Dialog>
  );
}

export default ConfirmationWindow;

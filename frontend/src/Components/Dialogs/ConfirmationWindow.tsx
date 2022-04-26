import { Dialog, styled } from '@mui/material';
import React from 'react';
import CBtn from '../Commons/CBtn';

interface ConfirmationWindowProps {
  children?: string | React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  confirm: () => void;
  cancel?: () => void;
}
const CustomBox = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.bg,
  color: theme.palette.txt,
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
      <CustomBox>
        {children}

        <CBtn
          onClick={() => {
            setOpen(false);
            cancel();
          }}>
          취소
        </CBtn>
        <CBtn
          onClick={() => {
            setOpen(false);
            confirm();
          }}>
          확인
        </CBtn>
      </CustomBox>
    </Dialog>
  );
}

export default ConfirmationWindow;

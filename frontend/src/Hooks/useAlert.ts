import { useTheme } from '@mui/material';
import Swal from 'sweetalert2';

function useAlert() {
  const theme = useTheme();

  const customAlert = Swal.mixin({
    icon: 'warning',
    confirmButtonColor: theme.palette.warn,
    cancelButtonColor: theme.palette.component,
    color: theme.palette.txt,
    background: theme.palette.bg,
    confirmButtonText: '닫기',
    customClass: {
      // cancelButton: classes.customCancelButton,
    },
    reverseButtons: true,
  });

  return customAlert;
}

export default useAlert;

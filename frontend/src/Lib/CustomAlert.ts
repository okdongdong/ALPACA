import Swal from 'sweetalert2';
import { useTheme } from '@mui/material';

export const CSwal = () => {
  const theme = useTheme();
  return Swal.mixin({
    background: theme.palette.main,
  });
};

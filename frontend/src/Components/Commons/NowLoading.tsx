import { Backdrop, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';

function NowLoading() {
  const nowLoading = useSelector((state: any) => state.commonReducer.nowLoading);

  return (
    <Backdrop sx={{ color: '#fff', zIndex: 12000 }} open={nowLoading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

export default NowLoading;

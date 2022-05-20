import { Backdrop, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';

function NowLoading() {
  const nowLoading = useSelector((state: any) => state.common.nowLoading);
  const nowLoadingMessage = useSelector((state: any) => state.common.nowLoadingMessage);

  return (
    <Backdrop sx={{ color: '#fff', zIndex: 12000 }} open={nowLoading}>
      <CircularProgress color="inherit" />
      {nowLoadingMessage && (
        <span style={{ fontSize: '2rem', color: '#FFFFFF', marginLeft: '20px' }}>
          {nowLoadingMessage}
        </span>
      )}
    </Backdrop>
  );
}

export default NowLoading;

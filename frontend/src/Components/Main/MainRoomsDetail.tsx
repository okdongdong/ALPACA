import { Button, Grid } from '@mui/material';
import styles from './MainRoomsDetail.module.css';
import PushPinIcon from '@mui/icons-material/PushPin';
import alpaca from '../../Assets/Img/alpaca.png';
import { styled, useTheme } from '@mui/material/styles';
import { customAxios } from '../../Lib/customAxios';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../Redux/accountReducer';
import { useNavigate } from 'react-router-dom';

export interface StudyCreateProps {
  detail: any;
  page: number;
  callback: Function;
}

const NameLabel = styled('label')(({ theme }) => ({
  color: theme.palette.txt,
  textAlign: 'center',
  width: '200px',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  position: 'absolute',
  bottom: 10,
  left: '50%',
  transform: 'translate(-50%,0)',
}));

const CButton = styled(Button)(({ theme }) => ({
  minHeight: 48,
  display: 'Grid',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '10px',
  borderRadius: '10px',
  background: theme.palette.main,
  height: '200px',
  width: '200px',
  position: 'relative',
  '&:hover': {
    background: theme.palette.main + '90',
  },
}));

function MainRoomsDetail(props: StudyCreateProps) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state: any) => state.account);
  const temp = props.detail.profileImgList.slice(0, 4);

  const pinStudy = async () => {
    try {
      await customAxios({
        method: 'post',
        url: `/study/${props.detail.id}`,
      });
      pinCheckOn();
    } catch (e) {
      console.log(e);
    }
  };

  const pinCheckOn = async () => {
    try {
      const res = await customAxios({
        method: 'get',
        url: `/study`,
        params: { page: 0 },
      });
      const resUserInfo = { ...userInfo };
      resUserInfo.studies = res.data.content;
      dispatch(setUserInfo(resUserInfo));
      props.callback(1, res.data.content);
    } catch (e) {
      console.log(e);
    }
  };

  const goStudy = () => {
    navigate(`/room/${props.detail.id}`);
  };

  return (
    <div style={{ position: 'relative' }}>
      <PushPinIcon
        sx={{
          position: 'absolute',
          top: 12,
          left: 12,
          color:
            props.detail.pinnedTime === '0001-01-01T06:00:00' || props.detail.pinnedTime === null
              ? theme.palette.bg
              : theme.palette.component_accent,
          margin: 0,
          padding: 0,
          height: '35px',
          width: '35px',
          zIndex: 1,
        }}
        onClick={pinStudy}></PushPinIcon>
      <CButton onClick={goStudy}>
        <Grid container sx={{ padding: 2 }}>
          {temp.map((item: string, i: number) => {
            return (
              <Grid item xs={6} key={i} sx={{ padding: 0 }}>
                <img src={!!item ? item : alpaca} className={styles.profileimg_mini} alt="" />
              </Grid>
            );
          })}
        </Grid>
        <NameLabel sx={{ px: '8px' }}>{props.detail.title}</NameLabel>
      </CButton>
    </div>
  );
}

export default MainRoomsDetail;

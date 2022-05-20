import { Dialog, Grid, Stack, styled, useTheme } from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { customAxios, solvedAcAxios } from '../../Lib/customAxios';
import { setLoading } from '../../Redux/commonReducer';
import CBadge from '../Commons/CBadge';
import CBtn from '../Commons/CBtn';
import CSearchBar from '../Commons/CSearchBar';
import useAlert from '../../Hooks/useAlert';

interface BojIdSearchProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setBojId: React.Dispatch<React.SetStateAction<string>>;
}

interface BojUserInfo {
  bojId: string;
  tier: number;
  solvedCount: number;
  rank: number;
}

const CustomBox = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.bg,
  color: theme.palette.txt,
  padding: theme.spacing(3),
}));

const CustomContent = styled('div')(({ theme }) => ({
  minWidth: 450,
  maxHeight: '60vh',
  position: 'relative',
}));

const BojSearchResult = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.bg,
  color: theme.palette.txt,
  justifyContent: 'center',
  textAlign: 'center',
}));

function BojIdSearch({ open, setOpen, setBojId }: BojIdSearchProps) {
  const dispatch = useDispatch();

  const cAlert = useAlert();
  const theme = useTheme();

  const [idList, setIdList] = useState<BojUserInfo[]>([]);
  const [searchId, setSearchId] = useState<string>('');

  const getBojIdList = async () => {
    dispatch(setLoading(true));

    try {
      const res = await solvedAcAxios({
        method: 'get',
        url: '/search/user',
        params: {
          query: searchId,
        },
      });
      const resInfoList: BojUserInfo[] = [];

      // 필요한 정보만 추출
      res.data.items.forEach((item: any) => {
        const userInfo: BojUserInfo = {
          bojId: item.handle,
          tier: item.tier,
          solvedCount: item.solvedCount,
          rank: item.rank,
        };

        resInfoList.push(userInfo);
      });

      setIdList(resInfoList);
    } catch (e) {
      // console.log(e);
    }

    dispatch(setLoading(false));
  };

  const onClickHandler = (bojId: string) => {
    bojDuplicateCheck(bojId);
  };

  // 백준연결
  const bojDuplicateCheck = async (bojId: string) => {
    dispatch(setLoading(true));

    // 중복 x
    try {
      await customAxios({
        method: 'get',
        url: '/auth/duplicated/bojId',
        params: { bojId },
      });
      // console.log(res);
      dispatch(setLoading(false));

      const result = await cAlert.fire({
        title: 'BOJ 연동',
        text: `${bojId}를 연결하시겠습니까?`,
        icon: 'question',
        showConfirmButton: true,
        confirmButtonColor: theme.palette.main,
        confirmButtonText: '연결',
        showCancelButton: true,
      });

      if (result.isConfirmed) {
        setBojId(bojId);
        setOpen(false);
      }

      // 중복 o
    } catch (e: any) {
      // console.log(e.response);
      dispatch(setLoading(false));
      if (e.response.status === 409) {
        const result = await cAlert.fire({
          title: 'BOJ 연동',
          html: `${bojId}의 연결기록이 이미 존재합니다.<br/><br/>연결하시겠습니까?`,
          icon: 'question',
          showConfirmButton: true,
          confirmButtonColor: theme.palette.main,
          confirmButtonText: '연결',
          showCancelButton: true,
        });

        if (result.isConfirmed) {
          setBojId(bojId);
          setOpen(false);
        }
      }
      cAlert.fire({
        title: '연동 실패!',
        text: e.response.data.message || '잠시 후 다시 시도해주세요.',
        icon: 'error',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <CustomBox spacing={3}>
        <h1>BOJ 아이디 검색</h1>
        <CSearchBar onSearch={getBojIdList} onChange={setSearchId} />
        <div>*아이디는 최대 100개까지만 검색됩니다.</div>
        <CustomContent className="scroll-box">
          <Stack spacing={1}>
            {idList.map((item, idx) => (
              <BojSearchResult key={idx} container>
                <Grid item xs={1}>
                  <CBadge tier={item.tier} />
                </Grid>
                <Grid item xs={5}>
                  {item.bojId}
                </Grid>
                <Grid item xs={3}>
                  <div>{item.solvedCount} solved</div>
                  <div> 🏅{item.rank}</div>
                </Grid>
                <Grid item xs={2} sx={{ height: '100%' }}>
                  <CBtn content="선택" onClick={() => onClickHandler(item.bojId)} />
                </Grid>
              </BojSearchResult>
            ))}
          </Stack>
        </CustomContent>
      </CustomBox>
    </Dialog>
  );
}

export default BojIdSearch;

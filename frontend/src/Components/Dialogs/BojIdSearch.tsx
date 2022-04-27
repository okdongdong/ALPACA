import { Dialog, Grid, Stack, styled } from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { customAxios, solvedAcAxios } from '../../Lib/customAxios';
import { setLoading } from '../../Redux/commonReducer';
import CBtn from '../Commons/CBtn';
import CSearchBar from '../Commons/CSearchBar';
import ConfirmationWindow from './ConfirmationWindow';

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
  maxHeight: 600,
  overflowY: 'scroll',
  /* 스크롤바 설정*/
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  /* 스크롤바 막대 설정*/
  '&::-webkit-scrollbar-thumb': {
    height: '100px',
    backgroundColor: 'rgba(100,100,100,0.5)',
    borderRadius: ' 10px',
  },
  /* 스크롤바 뒷 배경 설정*/
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'rgba(0,0,0,0)',
  },
}));

const BojSearchResult = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.bg,
  color: theme.palette.txt,
  justifyContent: 'center',
  textAlign: 'center',
}));

function BojIdSearch({ open, setOpen, setBojId }: BojIdSearchProps) {
  const dispatch = useDispatch();

  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState<boolean>(false);
  const [idList, setIdList] = useState<BojUserInfo[]>([]);
  const [searchId, setSearchId] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string>('');
  const [isDuplicate, setIsDuplicate] = useState<boolean>(false);

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
      res.data.items.map((item: any) => {
        const userInfo: BojUserInfo = {
          bojId: item.handle,
          tier: item.tier,
          solvedCount: item.solvedCount,
          rank: item.rank,
        };

        resInfoList.push(userInfo);
      });

      setIdList((prev) => [...prev, ...resInfoList]);
    } catch (e) {
      console.log(e);
    }

    dispatch(setLoading(false));
  };

  const onClickHandler = (bojId: string) => {
    setSelectedId(bojId);
    bojDuplicateCheck();
  };

  // 백준연결
  const bojDuplicateCheck = async () => {
    dispatch(setLoading(true));

    // 중복 x
    try {
      const res = await customAxios({
        method: 'get',
        url: '/auth/duplicated/bojId',
        params: { bojId: selectedId },
      });
      console.log(res);
      setBojId(selectedId);
      setIsDuplicate(false);

      // 중복 o
    } catch (e) {
      console.log(e);
      setIsDuplicate(true);
    }
    setDuplicateDialogOpen(true);
    dispatch(setLoading(false));
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <ConfirmationWindow
        open={duplicateDialogOpen}
        setOpen={setDuplicateDialogOpen}
        confirm={() => {
          setBojId(selectedId);
          setOpen(false);
        }}>
        {isDuplicate ? (
          <>
            <div>{selectedId}의 연결기록이 이미 존재합니다.</div>
            <div>연결하시겠습니까?</div>
          </>
        ) : (
          <div>{selectedId}를 연결하시겠습니까?</div>
        )}
      </ConfirmationWindow>
      <CustomBox spacing={3}>
        <h1>BOJ 아이디 검색</h1>
        <CSearchBar onSearch={getBojIdList} onChange={setSearchId} />
        <div>*아이디는 최대 100개까지만 검색됩니다.</div>
        <CustomContent>
          <Stack spacing={1}>
            {idList.map((item, idx) => (
              <BojSearchResult key={idx} container>
                <Grid item xs={1}>
                  {item.tier}
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

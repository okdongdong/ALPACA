import { Dialog, DialogTitle, Stack, styled } from '@mui/material';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { solvedAcAxios } from '../../Lib/customAxios';
import { setLoading } from '../../Redux/common/commonAction';
import CBtn from '../Commons/CBtn';
import CInputWithBtn from '../Commons/CInputWithBtn';
import CSearchBar from '../Commons/CSearchBar';

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

const CustomBox = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.bg,
  color: theme.palette.txt,
}));

const CustomContent = styled('div')(({ theme }) => ({
  minWidth: 600,
  maxHeight: 600,
  overflowY: 'scroll',
}));

function BojIdSearch({ open, setOpen, setBojId }: BojIdSearchProps) {
  const dispatch = useDispatch();

  // 인피니티 스크롤 확인용
  const interSectRef = useRef<HTMLDivElement>(null);
  const nowLoading = useSelector((state: any) => state.commonReducer.nowLoading);

  const [page, setPage] = useState<number>(1);
  const [isFinished, setIsFinished] = useState<boolean>(true);
  const [idList, setIdList] = useState<BojUserInfo[]>([]);
  const [searchId, setSearchId] = useState<string>('');

  const onChangeHandler = () => {};

  const infiniteHandler = () => {
    getBojIdList();
  };

  const getBojIdList = async () => {
    dispatch(setLoading(true));

    try {
      const res = await solvedAcAxios({
        method: 'get',
        url: '/search/user',
        params: {
          query: searchId,
          page: page,
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

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <CustomBox>
        <DialogTitle>BOJ 아이디 검색</DialogTitle>
        <CSearchBar onSearch={getBojIdList} onChange={setSearchId} />
        <div>*아이디는 최대 100개까지만 검색됩니다.</div>
        <CustomContent>
          <Stack spacing={1}>
            {idList.map((item, idx) => (
              <div key={idx}>
                <span>bojId :{item.bojId}</span>
                <span>tier :{item.tier}</span>
                <span>solvedCount :{item.solvedCount}</span>
                <span>rank :{item.rank}</span>
                <CBtn
                  content="선택"
                  onClick={() => {
                    setBojId(item.bojId);
                    setOpen(false);
                  }}
                />
              </div>
            ))}
          </Stack>
        </CustomContent>
      </CustomBox>
    </Dialog>
  );
}

export default BojIdSearch;

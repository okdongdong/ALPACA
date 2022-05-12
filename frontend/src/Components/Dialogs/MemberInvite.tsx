import { Avatar, Chip, Collapse, Dialog, Divider, Input, Stack, styled } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { customAxios } from '../../Lib/customAxios';
import { setLoading } from '../../Redux/commonReducer';
import CBtn from '../Commons/CBtn';
import CProfile from '../Commons/CProfile';
import CSearchBar from '../Commons/CSearchBar';
import alpaca from '../../Assets/Img/alpaca.png';
import CInput from '../Commons/CInput';
import useAlert from '../../Hooks/useAlert';

interface MemberInviteProps {
  roomId: string | undefined;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface UserInfo {
  id: number;
  nickname: string;
  profileImg: string;
}

const CustomBox = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.bg,
  color: theme.palette.txt,
  padding: theme.spacing(3),
  minWidth: 450,
}));

const SearchResultBox = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.component,
  height: '30vh',
}));

const CChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.main,
  color: theme.palette.txt,
}));

const CustomInput = styled(Input)(({ theme }) => ({
  color: theme.palette.txt,
  width: 270,
  '&:before': { borderBottom: `1px solid ${theme.palette.txt}` },
  '&:after': {
    borderBottom: `2px solid ${theme.palette.accent}`,
  },
}));

function MemberInvite({ roomId, open, setOpen }: MemberInviteProps) {
  const dispatch = useDispatch();
  const cAlert = useAlert();
  const [nickname, setNickname] = useState<string>('');
  const [userList, setUserList] = useState<UserInfo[]>([]);
  const [inviteCode, setInviteCode] = useState('ㅁㄴㅇㄹㄴㄴㅇㄹ');
  const [selectedUserList, setSelectedUserList] = useState<UserInfo[]>([]);

  // 초대코드 조회
  const getInviteCode = async () => {
    try {
      const res = await customAxios({
        method: 'get',
        url: `/study/${roomId}/inviteCode`,
      });
      console.log('inviteCode: ', res.data.message);
      setInviteCode(res.data.message);
    } catch (e: any) {
      console.log(e);
    }
  };

  // 초대코드 복사
  const copyInviteCode = async () => {
    if (navigator.clipboard) {
      // IE는 사용 못하고, 크롬은 66버전 이상일때 사용 가능
      navigator.clipboard
        .writeText(`${process.env.REACT_APP_CLIENT_URL}/invite/${inviteCode}`)
        .then(() => {
          console.log('초대코드를 복사하는데 성공했습니다.');
          cAlert.fire({
            title: '복사 성공',
            text: '초대코드를 복사하는데 성공했습니다.',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          });
        })

        .catch(() => {
          console.log('초대코드를 복사하는데 실패했습니다.');
          cAlert.fire({
            title: '복사 실패',
            text: '잠시 후 다시 시도해주세요..',
            icon: 'error',
            showConfirmButton: false,
            timer: 1500,
          });
        });
    } else {
      cAlert.fire({
        title: '복사 실패',
        text: '복사하기가 지원되지 않는 브라우저입니다.',
        icon: 'error',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  // 타이핑할때마다 유저이름을 검색하는 함수
  const searchUserByNickname = async () => {
    if (!nickname) return;

    dispatch(setLoading(true));
    try {
      const res = await customAxios({
        method: 'get',
        url: `/user/search`,
        params: { nickname },
      });
      console.log(res);
      const tempList: UserInfo[] = [];

      // 검색결과 중 선택된 유저리스트에 이미 있는 유저는 추가하지 않음
      res.data.forEach((userInfo: UserInfo) => {
        if (
          selectedUserList.every(
            (selectedUserInfo: UserInfo) => selectedUserInfo.id !== userInfo.id,
          )
        )
          tempList.push(userInfo);
      });

      setUserList(res.data);
    } catch (e: any) {
      console.log(e);
    }

    dispatch(setLoading(false));
  };

  // 검색결과를 선택된 유저리스트에 추가하는 함수
  const searchResultClickHandler = (idx: number) => {
    const tempList = [...userList];
    const selectedUser = tempList.splice(idx, 1);
    setUserList(tempList);
    setSelectedUserList((prevList) => [...prevList, ...selectedUser]);
  };

  // 선택된 유저리스트에서 유저를 삭제하는 함수
  const deleteHandler = (idx: number) => {
    const tempList = [...selectedUserList];
    tempList.splice(idx, 1);

    setSelectedUserList(tempList);
  };

  // 검색창 변경시마다 검색요청
  useEffect(() => {
    searchUserByNickname();
  }, [nickname]);

  useEffect(() => {
    getInviteCode();
  }, []);

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <CustomBox spacing={2}>
        <h1>스터디원 초대하기</h1>
        <CSearchBar onChange={setNickname} />
        <Collapse in={!!userList}>
          <SearchResultBox>
            {userList.map((userInfo, idx) => (
              <div key={idx} onClick={() => searchResultClickHandler(idx)}>
                <CProfile nickname={userInfo.nickname} profileImg={userInfo.profileImg} />
              </div>
            ))}
          </SearchResultBox>
        </Collapse>

        <div>
          {selectedUserList.map((userInfo, idx) => (
            <div key={idx}>
              <CChip
                avatar={<Avatar src={!!userInfo.profileImg ? userInfo.profileImg : alpaca} />}
                label={userInfo.nickname}
                onDelete={() => deleteHandler(idx)}
              />
            </div>
          ))}
        </div>
        <div style={{ alignSelf: 'end' }}>
          <CBtn width="100px" onClick={() => {}}>
            초대
          </CBtn>
        </div>
        <div>
          <Divider>
            <span>or</span>
          </Divider>
        </div>

        <h3>초대링크</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <CustomInput value={`${process.env.REACT_APP_CLIENT_URL}/${inviteCode}`} readOnly />
          <CBtn width="100px" onClick={copyInviteCode}>
            복사
          </CBtn>
        </div>
      </CustomBox>
    </Dialog>
  );
}

export default MemberInvite;

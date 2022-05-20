import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, Stack, alpha, Box } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import CBtn from '../Commons/CBtn';
import Chip from '@mui/material/Chip';
import { customAxios } from '../../Lib/customAxios';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../Redux/accountReducer';
import alpaca from '../../Assets/Img/alpaca.png';
import { isMobile } from 'react-device-detect';
import CInput from '../Commons/CInput';
import CProfile from '../Commons/CProfile';
import { Close, Search } from '@mui/icons-material';
import CInputWithBtn from '../Commons/CInputWithBtn';
import useAlert from '../../Hooks/useAlert';

export interface StudyCreateProps {
  open: boolean;
  onClose: () => void;
  page: number;
  studyList: any;
  callback: Function;
}

interface Member {
  id: number;
  nickname: string;
  profileImg?: string;
}

const SearchResultBox = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.component,
  position: 'relative',
  height: '20vh',
}));

const CDialogTitle = styled(DialogTitle)(({ theme }) => ({
  padding: theme.spacing(2),
  fontSize: isMobile ? 12 : '',
  backgroundColor: theme.palette.accent,
  color: theme.palette.icon,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const CustomContent = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.bg,
  color: theme.palette.txt,
  padding: theme.spacing(3),
  minWidth: isMobile ? 300 : 450,
}));

const MemberArray = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'left',
  // flexWrap: 'wrap',
  overflowX: 'scroll',
  listStyle: 'none',
  padding: 0.5,
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  height: theme.spacing(8),
}));

const ListChip = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const CChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.main,
  color: theme.palette.txt,
}));

function StudyCreate(props: StudyCreateProps) {
  const { onClose, open } = props;

  const dispatch = useDispatch();
  const theme = useTheme();
  const userInfo = useSelector((state: any) => state.account);
  const cAlert = useAlert();

  const [studyname, setStudyName] = useState('');
  const [studyintro, setStudyIntro] = useState('');
  const [memberList, setMemberList] = useState<Member[]>([]);
  const [getUser, setgetUser] = useState<Member[]>([]);
  const [nameMessage, setNameMessage] = useState<string>('');
  const [introMessage, setIntroMessage] = useState<string>('');
  const [searchNickname, setSearchNickname] = useState<string>('');

  const nameRegex = /^.{0,50}$/;
  const introRegex = /^.{0,500}$/;

  useEffect(() => {
    if (nameRegex.test(studyname)) {
      setNameMessage('');
    } else {
      setNameMessage('50자 이하로 입력하세요.');
    }
  }, [studyname]);

  useEffect(() => {
    if (introRegex.test(studyintro)) {
      setIntroMessage('');
    } else {
      setIntroMessage('500자 이하로 입력하세요.');
    }
  }, [studyintro]);

  useEffect(() => {
    setMemberList([]);
    setgetUser([]);
  }, [open]);

  useEffect(() => {
    userSearch();
  }, [searchNickname]);

  const handleClose = () => {
    createData();
  };

  const cancleClose = () => {
    setStudyName('');
    setStudyIntro('');
    setMemberList([]);
    onClose();
  };
  const handleDelete = (chipToDelete: Member) => () => {
    if (userInfo.userId !== chipToDelete.id)
      setMemberList((chips) => chips.filter((chip) => chip.id !== chipToDelete.id));
  };

  const createData = async () => {
    if (!studyname) {
      setNameMessage('스터디 이름을 입력해주세요.');
      return;
    }
    if (!studyintro) {
      setIntroMessage('스터디 소개를 입력해주세요.');
      return;
    }
    const sendList = memberList.map((data) => data.id);
    try {
      const res = await customAxios({
        method: 'post',
        url: `/study`,
        data: {
          info: studyintro,
          memberIdList: sendList,
          title: studyname,
        },
      });
      const resUserInfo = { ...userInfo };
      resUserInfo.studies = [...resUserInfo.studies, res.data];
      dispatch(setUserInfo(resUserInfo));
      const page = Math.ceil(resUserInfo.studies.length / 3);
      props.callback(page, resUserInfo.studies);
      cAlert.fire({
        title: '생성 성공!!',
        text: '스터디 생성에 성공했습니다!',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
      onClose();
      setStudyName('');
      setStudyIntro('');
      setMemberList([]);
    } catch (e: any) {
      cAlert.fire({
        title: '생성 실패!',
        text: e.response.data.message || '잠시 후 다시 시도해주세요.',
        icon: 'error',
        showConfirmButton: false,
        timer: 1500,
      });
      // console.log(e.response);
    }
  };

  const userSearch = async () => {
    if (!searchNickname) return;

    try {
      const res = await customAxios({
        method: 'get',
        url: `/user/search`,
        params: { nickname: searchNickname },
      });
      setgetUser(res.data);
      // console.log('getUserList: ', res);
    } catch (e: any) {
      // console.log(e.response);
    }
  };

  return (
    <Dialog onClose={cancleClose} open={open} fullScreen={isMobile}>
      <CDialogTitle>
        <div style={{ fontSize: 24, fontWeight: 'bold' }}>스터디 생성</div>
        <Close onClick={cancleClose} />
      </CDialogTitle>
      <CustomContent>
        <CInput label="스터디 이름" onChange={setStudyName} helperText={nameMessage} multiline />
        <CInput label="스터디 소개" onChange={setStudyIntro} helperText={introMessage} multiline />
        <CInputWithBtn
          label="스터디원 검색"
          onChange={setSearchNickname}
          buttonBackgroundColor="rgba(0,0,0,0)"
          buttonContent={<Search />}
          onButtonClick={() => {}}
        />

        <SearchResultBox className="scroll-box">
          {getUser.map((item: Member, idx: number) => {
            return (
              <Box
                sx={{
                  py: 1,
                  backgroundColor:
                    idx % 2 ? alpha(theme.palette.bg, 0.3) : alpha(theme.palette.main, 0.3),
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: 'fit-content',
                }}
                key={`search-result-${idx}`}
                onClick={() => {
                  setMemberList((prev) => {
                    if (
                      !prev.some((samedata) => {
                        return samedata.id === item.id;
                      })
                    )
                      return [...prev, item];
                    else return [...prev];
                  });
                }}>
                <CProfile nickname={item.nickname} profileImg={item.profileImg} />
              </Box>
            );
          })}
        </SearchResultBox>
        <MemberArray>
          <ListChip>
            <CChip
              avatar={<Avatar src={userInfo.profileImg ? userInfo.profileImg : alpaca} />}
              label={userInfo.nickname}
            />
          </ListChip>

          {memberList.map((data: Member, idx: number) => {
            return (
              <ListChip key={`added-member-${idx}`}>
                <CChip
                  avatar={<Avatar src={!!data.profileImg ? data.profileImg : alpaca} />}
                  label={data.nickname}
                  onDelete={handleDelete(data)}
                />
              </ListChip>
            );
          })}
        </MemberArray>
        <Grid item sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <CBtn content="닫기" onClick={cancleClose} width="30%" height="100%"></CBtn>
          <CBtn
            content="확인"
            onClick={handleClose}
            width="30%"
            height="100%"
            disabled={!!nameMessage || !!introMessage}></CBtn>
        </Grid>
      </CustomContent>
    </Dialog>
  );
}

export default StudyCreate;

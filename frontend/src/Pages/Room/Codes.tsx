import React, { useEffect, useState } from 'react';
import { customAxios } from '../../Lib/customAxios';
import { useLocation, useParams } from 'react-router-dom';
import Editor, { useMonaco } from '@monaco-editor/react';
import { useTheme } from '@mui/material/styles';
import { Divider, Grid } from '@mui/material';
import RoomCodeRecordTime from '../../Components/Room/Codes/RoomCodeRecordTime';
import RoomCompileTitle from '../../Components/Room/Compile/RoomCompileTitle';
import CProfile from '../../Components/Commons/CProfile';
import ALPACA from '../../Assets/Img/alpaca.png';
type codeInfoType = {
  language: string;
  submittedAt: string;
  submittedCode: string;
};

type problemInfoType = {
  problemNumber: number;
  level: number;
  title: string;
};

function Codes() {
  const monaco = useMonaco();
  const theme = useTheme();
  const location = useLocation();
  const { problemId, userId } = useParams();
  const studyId = location.state;
  const [curCode, setCurCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('python');
  const [problemInfo, setProblemInfo] = useState<problemInfoType>();
  const [codeList, setCodeList] = useState<codeInfoType[]>();
  const [nickname, setNickname] = useState<string>('성아영');
  const [profileImg, setProfileImg] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    getCodeInfo();
  }, []);

  const getCodeInfo = async () => {
    if (!problemId) return;

    try {
      const params = studyId
        ? {
            problemNumber: parseInt(problemId),
            studyId: studyId,
          }
        : {
            problemNumber: parseInt(problemId),
          };
      const res = await customAxios({
        method: 'get',
        url: `/code/${userId}`,
        params,
      });
      setNickname(res.data.nickname);
      setProblemInfo({
        level: res.data.level,
        title: res.data.title,
        problemNumber: res.data.problemNumber,
      });
      setProfileImg(res.data.profileImg || ALPACA);
      setCodeList(res.data.codeSet);
    } catch (e: any) {
      setErrorMessage(e.response.data.message);
    }
  };

  monaco?.editor.defineTheme('myTheme', {
    base: 'vs',
    inherit: true,
    rules: [{ token: '', background: theme.palette.component }],
    colors: {
      'editor.foreground': theme.palette.txt,
      'editor.background': theme.palette.component,
      'editorCursor.foreground': theme.palette.txt + '99',
      'editor.lineHighlightBackground': theme.palette.bg + '99',
      'editorLineNumber.foreground': theme.palette.accent,
      'editor.selectionBackground': theme.palette.main + '30',
      'editor.inactiveSelectionBackground': theme.palette.main + '15',
    },
  });
  return (
    <>
      {problemInfo ? (
        <Grid
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}>
          <RoomCompileTitle
            tier={problemInfo.level}
            problemTitle={problemInfo.title}
            problemId={problemInfo.problemNumber}
          />
          <div style={{ position: 'absolute', top: '1vh', right: '2vw' }}>
            <CProfile nickname={nickname} profileImg={profileImg} />
          </div>
          <Grid
            container
            sx={{
              height: '100%',
              width: '100%',
              display: 'flex',
              justifyContent: 'space-around',
            }}
            columns={20}
            spacing={6}>
            <Grid item xs={20} md={3}>
              {codeList && (
                <RoomCodeRecordTime
                  setCode={setCurCode}
                  setLanguage={setLanguage}
                  codeList={codeList}
                />
              )}
            </Grid>
            <Grid item xs={20} md={17}>
              <Editor
                height="calc(100% - 3vh)" // By default, it fully fits with its parent
                theme="myTheme"
                value={curCode}
                language={language}
                options={{
                  readOnly: true,
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <>{errorMessage ? errorMessage : ''}</>
      )}
    </>
  );
}

export default Codes;

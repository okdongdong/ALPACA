import React, { useEffect, useState, useRef } from 'react';
import { customAxios } from '../../Lib/customAxios';
import RoomCompileTitle from '../../Components/Room/Compile/RoomCompileTitle';
import RoomComplileTest from '../../Components/Room/Compile/RoomComplileTest';
import RoomCompileSelectLanguageBtn from '../../Components/Room/Compile/RoomCompileSelectLanguageBtn';
import Editor, { useMonaco } from '@monaco-editor/react';
import { useParams } from 'react-router-dom';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import { setLoading, setLoadingMessage } from '../../Redux/commonReducer';

type Monaco = typeof monaco;
type problemInfoType = {
  level: number;
  title: string;
  problemNumber: number;
  inputs: string[];
  outputs: string[];
};

function Compile() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const preferredLanguage = useSelector((state: any) => state.account.preferredLanguage);
  const themeType = useSelector((state: any) => state.theme.themeType);
  const { problemId } = useParams();
  const [problemInfo, setProblemInfo] = useState<problemInfoType>();
  const [language, setLanguage] = useState<string>(
    preferredLanguage === 'python3' ? 'python' : preferredLanguage,
  );
  const [code, setCode] = useState<string>('');
  const monaco = useMonaco();
  monaco?.editor.defineTheme('myTheme', {
    base: themeType === 'dark' ? 'vs-dark' : 'vs',
    inherit: true,
    rules: [{ token: '', background: theme.palette.component }],
    colors: {
      'editor.foreground': theme.palette.txt,
      'editor.background': theme.palette.component,
      'editorCursor.foreground': theme.palette.txt + '99',
      'editor.lineHighlightBackground': theme.palette.bg + '99',
      'editorLineNumber.foreground': theme.palette.txt,
      'editorLineNumber.activeForeground': theme.palette.txt + '90',
      'editor.selectionBackground': theme.palette.main + '30',
      'editor.inactiveSelectionBackground': theme.palette.main + '15',
    },
  });
  useEffect(() => {
    // 문제관련 정보 가져오기
    getProblemInfo();
  }, []);

  const getProblemInfo = async () => {
    try {
      const res = await customAxios({
        method: 'get',
        url: `/problem/${problemId}`,
      });
      setProblemInfo(res.data);
    } catch (e) {}
  };

  const handleChange = (value: any, event: any) => {
    setCode(value);
  };

  const submitCode = async (tab: number, input?: string) => {
    const returnCode = code.replaceAll('\n', '\\n').replaceAll('\r', '\\r');
    const url = tab === 0 ? '/code/bojCompile' : '/code/compile';
    const data =
      tab === 0
        ? {
            code: returnCode,
            language: language === 'python' ? 'python3' : language,
            problemNumber: parseInt(problemId || '1000'),
          }
        : {
            code: returnCode,
            language: language === 'python' ? 'python3' : language,
            input,
          };
    dispatch(setLoading(true));
    dispatch(setLoadingMessage('채점중입니다'));
    try {
      const res = await customAxios({
        method: 'post',
        url,
        data,
      });
      dispatch(setLoading(false));
      return res.data;
    } catch (e) {}
    dispatch(setLoading(false));
  };

  const saveCode = async () => {
    dispatch(setLoading(true));
    try {
      const data = {
        code: code,
        language: language === 'python' ? 'python3' : language,
        problemNumber: parseInt(problemId || '1000'),
      };
      await customAxios({
        method: 'post',
        url: '/code',
        data,
      });
    } catch (e) {}
    dispatch(setLoading(false));
  };

  return (
    <>
      {problemInfo && (
        <Grid
          sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <RoomCompileTitle
            tier={problemInfo.level}
            problemTitle={problemInfo.title}
            problemId={problemInfo.problemNumber}
          />
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
            <Grid
              item
              xs={20}
              md={16}
              sx={{
                height: 'calc(100% - 80px)',
                // width: '80%',
              }}>
              <RoomCompileSelectLanguageBtn selectLanguage={setLanguage} />
              <Editor
                height="100%" // By default, it fully fits with its parent
                theme="myTheme"
                onChange={handleChange}
                value={code}
                language={language}
              />
            </Grid>
            <Grid item xs={20} md={4}>
              <RoomComplileTest
                inputs={problemInfo.inputs}
                outputs={problemInfo.outputs}
                submitCode={submitCode}
                saveCode={saveCode}
              />
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
  // <div>Compile : {problemId}</div>;
}

export default Compile;

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
import { useSelector } from 'react-redux';
type Monaco = typeof monaco;

function Compile() {
  const theme = useTheme();
  const preferredLanguage = useSelector((state: any) => state.account.preferredLanguage);
  const { problemId } = useParams();
  const [language, setLanguage] = useState<string>(
    preferredLanguage === 'python3' ? 'python' : preferredLanguage,
  );
  const [code, setCode] = useState<string>('');
  const editorRef = useRef(null);
  const monaco = useMonaco();
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
  useEffect(() => {
    // 문제관련 정보 가져오기
  }, []);

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
    const res = await customAxios({
      method: 'post',
      url,
      data,
    });
    console.log(res);
  };

  return (
    <>
      <Grid
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <RoomCompileTitle problemTitle="A+B" problemId={1000} />
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
            <RoomComplileTest submitCode={submitCode} />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
  // <div>Compile : {problemId}</div>;
}

export default Compile;

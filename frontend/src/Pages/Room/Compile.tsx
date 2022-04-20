import React, { useEffect, useState, useRef } from 'react';
import RoomCompileTitle from '../../Components/Room/Complie/RoomCompileTitle';
import RoomComplileTest from '../../Components/Room/Complie/RoomComplileTest';
import RoomCompileSelectLanguageBtn from '../../Components/Room/Complie/RoomCompileSelectLanguageBtn';
import Editor, { useMonaco } from '@monaco-editor/react';
import { useParams } from 'react-router-dom';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { Grid } from '@mui/material';

type Monaco = typeof monaco;

function Compile() {
  const { problemId } = useParams();
  const [language, setLanguage] = useState<string>('python');
  const [code, setCode] = useState<string>('');
  const editorRef = useRef(null);
  const monaco = useMonaco();
  monaco?.editor.defineTheme('myTheme', {
    base: 'vs',
    inherit: true,
    rules: [{ token: '', background: 'F2F2F2' }],
    colors: {
      'editor.foreground': '#000000',
      'editor.background': '#F2F2F2',
      'editorCursor.foreground': '#000000' + '99',
      'editor.lineHighlightBackground': '#FFFFFF' + '99',
      'editorLineNumber.foreground': '#3C5FAE',
      'editor.selectionBackground': '#97B2E1' + '30',
      'editor.inactiveSelectionBackground': '#97B2E1' + '15',
    },
  });
  useEffect(() => {
    // 문제관련 정보 가져오기
  }, []);

  const handleChange = (value: any, event: any) => {
    setCode(value);
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
            <RoomComplileTest />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
  // <div>Compile : {problemId}</div>;
}

export default Compile;

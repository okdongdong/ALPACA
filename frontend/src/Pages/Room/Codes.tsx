import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Editor, { useMonaco } from '@monaco-editor/react';
import { useTheme } from '@mui/material/styles';
import { Divider, Grid } from '@mui/material';
import RoomCodeRecordTime from '../../Components/Room/Codes/RoomCodeRecordTime';
import RoomCompileTitle from '../../Components/Room/Compile/RoomCompileTitle';
import CProfile from '../../Components/Commons/CProfile';

const times = [
  { time: '2022. 04. 03 12:00', id: 1 },
  { time: '2022. 04. 03 12:00', id: 1 },
  { time: '2022. 04. 03 12:00', id: 1 },
  { time: '2022. 04. 03 12:00', id: 1 },
];

function Codes() {
  const monaco = useMonaco();
  const theme = useTheme();

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
  const { codeId } = useParams();
  const [curCode, setCurCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('python');
  return (
    <>
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
        <RoomCompileTitle problemTitle="A+B" problemId={1000} />
        <div style={{ position: 'absolute', top: '1vh', right: '2vw' }}>
          <CProfile
            nickname="성아영"
            profileImg="https://avatars.githubusercontent.com/u/55776650?v=4"
          />
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
            <RoomCodeRecordTime setCode={setCurCode} times={times} />
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
    </>
  );
}

export default Codes;

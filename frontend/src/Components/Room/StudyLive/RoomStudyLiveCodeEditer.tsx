import React, { useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
// @ts-ignore
import { MonacoBinding } from 'y-monaco';
import Editor, { useMonaco } from '@monaco-editor/react';
import { useTheme, styled } from '@mui/material/styles';
import { ArrowRight, ArrowLeft, DragHandle } from '@mui/icons-material';
import { Icon, IconButton } from '@mui/material';

import RoomCompileSelectLanguageBtn from '../Compile/RoomCompileSelectLanguageBtn';

import './RoomStudyLiveCodeEditor.css';

// // @ts-ignore
// window.MonacoEnvironment = {
//   // @ts-ignore
//   getWorkerUrl: function (moduleId, label) {
//     if (label === 'json') {
//       return '/monaco/dist/json.worker.bundle.js';
//     }
//     if (label === 'css') {
//       return '/monaco/dist/css.worker.bundle.js';
//     }
//     if (label === 'html') {
//       return '/monaco/dist/html.worker.bundle.js';
//     }
//     if (label === 'typescript' || label === 'javascript') {
//       return '/monaco/dist/ts.worker.bundle.js';
//     }
//     return '/monaco/dist/editor.worker.bundle.js';
//   },
// };

const CustonIconBtn = styled(IconButton)(({ theme }) => ({
  background: theme.palette.main,
  borderRadius: '20px',
  width: '25px',
  height: '25px',
  color: theme.palette.icon,
  '&:hover': {
    background: theme.palette.main + '90',
  },
}));

const CustomDragHandle = styled(DragHandle)(({ theme }) => ({
  cursor: 'col-resize',
  transform: 'rotate(90deg)',
  color: theme.palette.main,
}));

type codeEditorProps = {
  openYjsDocs: Boolean;
  setOpenYjsDocs: Function;
  width: string;
};

function RoomStudyLiveCodeEditer({ openYjsDocs, setOpenYjsDocs, width }: codeEditorProps) {
  const ydoc = new Y.Doc();
  const provider = new WebsocketProvider('ws://192.168.219.106:1234', '1', ydoc);
  const ytext = ydoc.getText('monaco');
  const theme = useTheme();
  const editorRef = useRef(null);
  const [language, setLanguage] = useState('python');
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

  const handleEditorDidMount = (editor: any, monaco: any) => {
    // here is the editor instance
    // you can store it in `useRef` for further usage
    editorRef.current = editor;
    if (!editorRef.current) return;
    const monacoBinding = new MonacoBinding(
      ytext,
      /** @type {monaco.editor.ITextModel} */ editor.getModel(),
      new Set([editor]),
      provider.awareness,
    );

    // provider.awareness.on('update', (e) => {
    //   console.log(e);
    // });
  };

  return (
    <div className="h_100 align_center ">
      <div
        className="h_100 align_column_center radius_10"
        style={{
          width: openYjsDocs ? width : '2vw',
          background: theme.palette.component,
          transition: 'all .2s',
          overflow: 'hidden',
        }}>
        <div style={{ padding: '10px', color: theme.palette.txt }}>
          코드편집
          <CustonIconBtn
            size="small"
            onClick={() => {
              setOpenYjsDocs((prev: Boolean) => !prev);
            }}>
            {openYjsDocs ? <ArrowRight /> : <ArrowLeft />}
          </CustonIconBtn>
        </div>
        {openYjsDocs && (
          <Editor
            width={width}
            height="100%"
            theme="myTheme"
            language={language}
            onMount={handleEditorDidMount}
          />
        )}
      </div>
    </div>
  );
}

export default RoomStudyLiveCodeEditer;

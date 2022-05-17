import React, { useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
// @ts-ignore
import { MonacoBinding } from 'y-monaco';
import Editor, { useMonaco } from '@monaco-editor/react';
import { ArrowForwardIos, ArrowBackIosNew, DragHandle } from '@mui/icons-material';
import { Icon, IconButton, Tooltip, useTheme, styled } from '@mui/material';
import { useParams } from 'react-router-dom';
import RoomCompileSelectLanguageBtn from '../Compile/RoomCompileSelectLanguageBtn';

import './RoomStudyLiveCodeEditor.css';

const CustonIconBtn = styled(IconButton)(({ theme }) => ({
  borderRadius: '20px',
  width: '25px',
  height: '25px',
  color: theme.palette.txt,
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
  const { roomId } = useParams();
  const ydoc = new Y.Doc();
  const provider = new WebsocketProvider(process.env.REACT_APP_YJS_DOCS || '', roomId || '1', ydoc);
  const ytext = ydoc.getText('monaco');
  const theme = useTheme();
  const editorRef = useRef(null);
  const [language, setLanguage] = useState('python');
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);
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
        <div
          style={{ padding: '10px', color: theme.palette.txt }}
          className={openYjsDocs ? 'align_center' : 'align_column_center'}>
          <div style={{ textAlign: 'center' }}>코드 동시편집</div>
          <CustonIconBtn
            onMouseEnter={() => {
              setTooltipOpen(true);
            }}
            onMouseLeave={() => {
              setTooltipOpen(false);
            }}
            size="small"
            onClick={() => {
              setTooltipOpen(false);
              setOpenYjsDocs((prev: Boolean) => !prev);
            }}>
            {openYjsDocs ? (
              <Tooltip open={tooltipOpen} title="코드편집기 닫기">
                <ArrowForwardIos />
              </Tooltip>
            ) : (
              <Tooltip open={tooltipOpen} title="코드편집기 열기">
                <ArrowBackIosNew />
              </Tooltip>
            )}
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

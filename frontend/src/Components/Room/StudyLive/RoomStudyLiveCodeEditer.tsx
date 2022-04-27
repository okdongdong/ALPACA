import React, { useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
// @ts-ignore
import { MonacoBinding } from 'y-monaco';
import Editor, { useMonaco } from '@monaco-editor/react';
import IStandaloneCodeEditor, { editor } from 'monaco-editor';
import { useTheme } from '@mui/material/styles';
import RoomCompileSelectLanguageBtn from '../Compile/RoomCompileSelectLanguageBtn';

import './RoomStudyLiveCodeEditor.css';

// @ts-ignore
window.MonacoEnvironment = {
  // @ts-ignore
  getWorkerUrl: function (moduleId, label) {
    if (label === 'json') {
      return '/monaco/dist/json.worker.bundle.js';
    }
    if (label === 'css') {
      return '/monaco/dist/css.worker.bundle.js';
    }
    if (label === 'html') {
      return '/monaco/dist/html.worker.bundle.js';
    }
    if (label === 'typescript' || label === 'javascript') {
      return '/monaco/dist/ts.worker.bundle.js';
    }
    return '/monaco/dist/editor.worker.bundle.js';
  },
};

function RoomStudyLiveCodeEditer() {
  const ydoc = new Y.Doc();
  const provider = new WebsocketProvider('ws://localhost:1234', 'my-roomname', ydoc);
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

  function handleEditorDidMount(editor: any, monaco) {
    console.log(editor);
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

    provider.awareness.on('update', (e) => {
      console.log(e);
    });
  }

  return (
    <Editor
      height="10vh" // By default, it fully fits with its parent
      theme="myTheme"
      language={language}
      onMount={handleEditorDidMount}
    />
  );
}

export default RoomStudyLiveCodeEditer;

import React from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
// @ts-ignore
import { MonacoBinding } from 'y-monaco';
import monaco from 'monaco-editor';

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
  const provider = new WebsocketProvider('wss://localhost:1234', '1', ydoc);
  const ytext = ydoc.getText('monaco');

  const editor = monaco.editor.create(document.createElement('div'), {
    value: '',
    language: 'javascript',
    theme: 'vs-dark',
  });
  const monacoBinding = new MonacoBinding(
    ytext,
    editor.getModel(),
    new Set([editor]),
    provider.awareness,
  );

  return <div id="monaco-editor-share">RoomStudyLiveCodeEditer</div>;
}

export default RoomStudyLiveCodeEditer;

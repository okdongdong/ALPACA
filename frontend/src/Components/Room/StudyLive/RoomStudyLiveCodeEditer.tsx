import React, { useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
// @ts-ignore
import { MonacoBinding } from 'y-monaco';
import Editor, { useMonaco } from '@monaco-editor/react';
import {
  ArrowForwardIos,
  ArrowBackIosNew,
  DragHandle,
  KeyboardArrowDownOutlined,
  KeyboardArrowUpOutlined,
} from '@mui/icons-material';
import {
  IconButton,
  Tooltip,
  useTheme,
  styled,
  InputBase,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { setLoading, setLoadingMessage } from '../../../Redux/commonReducer';
import RoomCompileSelectLanguageBtn from '../Compile/RoomCompileSelectLanguageBtn';
import { customAxios } from '../../../Lib/customAxios';
import CBtn from '../../Commons/CBtn';

import './RoomStudyLiveCodeEditor.css';
import { useDispatch } from 'react-redux';

const CustonIconBtn = styled(IconButton)(({ theme }) => ({
  borderRadius: '20px',
  width: '25px',
  height: '25px',
  color: theme.palette.component_accent,
}));

const CustomDragHandle = styled(DragHandle)(({ theme }) => ({
  cursor: 'col-resize',
  transform: 'rotate(90deg)',
  color: theme.palette.main,
}));

const CustomInput = styled(InputBase)(({ theme }) => ({
  color: theme.palette.txt,
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.bg,
    padding: '10px 12px',
    transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
    fontFamily: 'Pretendard-Regular',
  },
}));

const CustomLabel = styled(InputLabel)(({ theme }) => ({
  color: theme.palette.txt,
  '&.Mui-focused': {
    color: theme.palette.component_accent,
  },
}));
type codeEditorProps = {
  openYjsDocs: Boolean;
  setOpenYjsDocs: Function;
  width: string;
};

function RoomStudyLiveCodeEditer({ openYjsDocs, setOpenYjsDocs, width }: codeEditorProps) {
  const { roomId } = useParams();
  const dispatch = useDispatch();
  const monaco = useMonaco();
  const ydoc = new Y.Doc();
  const provider = new WebsocketProvider(process.env.REACT_APP_YJS_DOCS || '', roomId || '1', ydoc);
  const ytext = ydoc.getText('monaco');
  const theme = useTheme();
  const editorRef = useRef<any>(null);
  const [language, setLanguage] = useState('python');
  const [openCompile, setOpenCompile] = useState<boolean>(false);
  const [compileTooltipOpen, setCompileTooltipOpen] = useState<boolean>(false);
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOutput('');
    setInput(event.target.value);
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
      'editorLineNumber.activeForeground': theme.palette.txt + '90',
      'editor.selectionBackground': theme.palette.main + '30',
      'editor.inactiveSelectionBackground': theme.palette.main + '15',
    },
  });

  const submitCode = async () => {
    if (!editorRef.current) return;
    const code = editorRef.current?.getValue();
    const returnCode = code.replaceAll('\n', '\\n').replaceAll('\r', '\\r');
    const returnInput = input.replaceAll('\n', '\\n').replaceAll('\r', '\\r');
    const data = {
      code: returnCode,
      language: language === 'python' ? 'python3' : language,
      input: returnInput,
    };
    dispatch(setLoading(true));
    dispatch(setLoadingMessage('코드실행중입니다'));
    try {
      const res = await customAxios({
        method: 'post',
        url: '/code/compile',
        data,
      });
      dispatch(setLoading(false));
      setOutput(res.data.output);
    } catch (e) {}
    dispatch(setLoading(false));
  };

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
    <div className="h_100 align_center" style={{ position: 'relative' }}>
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
            style={openYjsDocs ? { position: 'absolute', right: '-24px' } : {}}
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
                <ArrowBackIosNew />
              </Tooltip>
            ) : (
              <Tooltip open={tooltipOpen} title="코드편집기 열기">
                <ArrowForwardIos />
              </Tooltip>
            )}
          </CustonIconBtn>
        </div>
        {openYjsDocs && (
          <Editor
            width={width}
            height={openCompile ? '40vh' : '100%'}
            theme="myTheme"
            language={language}
            onMount={handleEditorDidMount}
          />
        )}
        {openYjsDocs && (
          <div style={{ height: openCompile ? '40vh' : 0, position: 'relative' }}>
            <IconButton
              onMouseEnter={() => {
                setCompileTooltipOpen(true);
              }}
              onMouseLeave={() => {
                setCompileTooltipOpen(false);
              }}
              onClick={() => {
                setOpenCompile((prev) => !prev);
                setCompileTooltipOpen(false);
              }}
              sx={{ position: 'absolute', left: '50%', top: -10, transform: 'translate(0, -50%)' }}>
              {openCompile ? (
                <Tooltip open={compileTooltipOpen} title="컴파일창 닫기">
                  <KeyboardArrowDownOutlined />
                </Tooltip>
              ) : (
                <Tooltip open={compileTooltipOpen} title="컴파일창 열기">
                  <KeyboardArrowUpOutlined />
                </Tooltip>
              )}
            </IconButton>
            <div>
              <RoomCompileSelectLanguageBtn selectLanguage={setLanguage} />
            </div>
            <div className="align_center">
              <FormControl
                variant="standard"
                sx={{ margin: '15px', width: `calc(${width} / 2 - 2vw)` }}>
                <CustomLabel shrink htmlFor="compile-input">
                  Input
                </CustomLabel>
                <CustomInput
                  placeholder="input 값을 입력해주세요"
                  rows={7}
                  multiline
                  id="compile-input"
                  value={input}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl
                variant="standard"
                sx={{ margin: '15px', width: `calc(${width} / 2 - 2vw)` }}>
                <CustomLabel shrink htmlFor="compile-output">
                  Output
                </CustomLabel>
                <CustomInput
                  inputProps={{
                    readOnly: true,
                  }}
                  placeholder="실행결과가 출력됩니다."
                  value={output}
                  rows={7}
                  multiline
                  id="compile-output"
                />
              </FormControl>
            </div>
            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <CBtn
                onClick={() => {
                  submitCode();
                }}>
                코드실행
              </CBtn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RoomStudyLiveCodeEditer;

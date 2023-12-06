import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import CodeMirror from '@uiw/react-codemirror';
import { zebraStripes } from '@uiw/codemirror-extensions-zebra-stripes';
import { langs } from '@uiw/codemirror-extensions-langs';
import { search } from '@codemirror/search';
import { Typography } from '@mui/material';


JsonEditor.propTypes = {
  value: PropTypes.object,
  HandleChangeIniJson: PropTypes.func,
  readOnly: PropTypes.bool,
};

function JsonEditor({value, HandleChangeIniJson, readOnly }) {

  const codeMirrorOptions = {
    lineNumbers: true,
    highlightActiveLineGutter: true,
    highlightSpecialChars: true,
    history: true,
    foldGutter: true,
    drawSelection: true,
    dropCursor: true,
    allowMultipleSelections: true,
    indentOnInput: true,
    syntaxHighlighting: true,
    bracketMatching: true,
    closeBrackets: true,
    autocompletion: true,
    rectangularSelection: true,
    crosshairCursor: true,
    highlightActiveLine: true,
    highlightSelectionMatches: true,
    closeBracketsKeymap: true,
    defaultKeymap: true,
    searchKeymap: true,
    historyKeymap: true,
    foldKeymap: true,
    completionKeymap: true,
    lintKeymap: true,
    mode: 'application/json',
  };

  return  <>
          <Typography variant='subtitle2' display="flex" alignItems="center">Note: <Typography variant='caption' sx={{ml:1}}> Ctrl + F / Cmd + F to find text in Editer</Typography></Typography>
          <CodeMirror 
            value={value} 
            onChange={(e) => HandleChangeIniJson(e)} 
            height="600px" 
            width='auto' 
            extensions={[zebraStripes({ step: 2 }), langs.json(),   search({top: true, searchPanelOpen: true,}) ]} 
            options={codeMirrorOptions}
            readOnly={readOnly}
          />
    </>
}

export default JsonEditor;
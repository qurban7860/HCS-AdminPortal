import { useState } from 'react';
import PropTypes from 'prop-types';
import CodeMirror from '@uiw/react-codemirror';
import { langs } from '@uiw/codemirror-extensions-langs';
import { search } from '@codemirror/search';
import * as events from '@uiw/codemirror-extensions-events';
import { Grid, Typography, useTheme, Button } from '@mui/material';

import Iconify from '../iconify';
import JsonEditorPopover from './JsonEditorPopover';
import { StyledTooltip } from '../../theme/styles/default-styles';

JsonEditor.propTypes = {
  value: PropTypes.string,
  HandleChangeIniJson: PropTypes.func,
  readOnly: PropTypes.bool,
  editable: PropTypes.bool,
  autoHeight: PropTypes.bool,
  formatButton: PropTypes.bool,
  formatButtonOnClick: PropTypes.func,
};

function JsonEditor({
  value,
  HandleChangeIniJson,
  readOnly,
  autoHeight,
  editable = true,
  formatButton = false,
  formatButtonOnClick = () => {},
}) {

  const [ anchorEl, setAnchorEl ] = useState(null);

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

  const preventPaste = (canEdit) => events.content({
    paste: (event) => {
      if (!canEdit) event.preventDefault();
    },
  });
  
  const handlePopoverOpen = (event) => setAnchorEl(event.currentTarget);
  const handlePopoverClose = () => setAnchorEl(null);
  const theme = useTheme();
  
  return  <Grid item md={12}>
          <Grid sx={{ display: { sm: 'block', md: 'flex', position:'sticky', borderBottom:'1px solid #cfcfcf',borderTop:'1px solid #cfcfcf', top:0, background:'#f5f5f5', zIndex:1 },  justifyContent: 'space-between' }} >
            <Typography variant='subtitle2' sx={{ml:1}} display="flex" alignItems="center">
              Note:
              <Typography variant='caption' sx={{ml:0.5}}>Ctrl + F / Cmd + F to find text in Code Editor</Typography>
            </Typography>
            {!readOnly && !formatButton && <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', ml: 2, mt: 0.5, mr:2 }}>
              Format:
              <Iconify onClick={handlePopoverOpen} icon="iconamoon:question-mark-circle-bold" sx={{ cursor: 'pointer' }} />
            </Typography>}
            {formatButton && (
              <StyledTooltip
                title="Click to format the text to JSON"
                placement="top"
                disableFocusListener
                tooltipcolor={theme?.palette?.primary?.main} 
                color={theme?.palette?.primary?.main}
              >
                <Button
                  onClick={() => formatButtonOnClick(value)}
                  sx={{ mx: 0.5, my: 0.5 }}
                  size="small"
                  variant="outlined"
                  color="primary"
                  endIcon={<Iconify icon="mdi:code-json" />}
                >
                  Format JSON
                </Button>
              </StyledTooltip>
            )}
          </Grid>
          <CodeMirror 
            value={value} 
            onChange={(e) => HandleChangeIniJson(e)}
            height={!autoHeight && 'calc(100vh - 400px)'} 
            width='auto' 
            extensions={[
              langs.json(), 
              search({top: true, searchPanelOpen: true}),
              preventPaste(editable)
            ]} 
            options={codeMirrorOptions}
            readOnly={readOnly}
            editable={editable}
            theme={theme?.palette?.mode}
          />
          <JsonEditorPopover open={anchorEl} onClose={handlePopoverClose} />
    </Grid>
}

export default JsonEditor;
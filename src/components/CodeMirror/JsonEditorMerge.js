import PropTypes from 'prop-types';
import { langs } from '@uiw/codemirror-extensions-langs';
import { search } from '@codemirror/search';
import { Grid, Typography, Box } from '@mui/material';
import CodeMirrorMerge from 'react-codemirror-merge';
import './style.css';
import ViewFormAuditBlock from '../ViewForms/ViewFormAuditBlock';

// Please don't destrcture below code! It will not work properly.
const Original = CodeMirrorMerge.Original;
const Modified = CodeMirrorMerge.Modified;

JsonEditorMerge.propTypes = {
  value: PropTypes.string,
  modifiedValue: PropTypes.string,
  HandleChangeIniJson: PropTypes.func,
  readOnly: PropTypes.bool,
};

function JsonEditorMerge({value, modifiedValue, HandleChangeIniJson, readOnly }) {



  return  (<Grid sx={{p:1 }}>
            <Box
              rowGap={2} columnGap={2} display="grid"
              gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
            >
              <Typography variant='h6' >{ value?.backupid || '' }</Typography>
              <Typography variant='h6' >{ modifiedValue?.backupid || '' }</Typography>
            </Box>
            <Typography variant='subtitle2' display="flex" alignItems="center">Note: <Typography variant='caption' sx={{ml:1}}> Ctrl + F / Cmd + F to find text in Code Editer</Typography></Typography>
              <div>
                <CodeMirrorMerge orientation="a-b" gutter highlightChanges >
                  <Original 
                    readOnly
                    value={ JSON.stringify( value?.configuration, null, 2 ) }  
                    extensions={[ langs.json(), search({top: true, searchPanelOpen: true }) ]} 
                  />
                  <Modified
                    readOnly
                    value={ JSON.stringify( modifiedValue?.configuration, null, 2 ) }
                    extensions={[ langs.json(), search({top: true, searchPanelOpen: true }) ]} 
                  />
                </CodeMirrorMerge>
              </div>
            <Box
              rowGap={2} columnGap={2} display="grid"
              gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
            >
              <ViewFormAuditBlock  defaultValues={value} />
              <ViewFormAuditBlock  defaultValues={modifiedValue} />
            </Box>
          </Grid>)
} 

export default JsonEditorMerge;